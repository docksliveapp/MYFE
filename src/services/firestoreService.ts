import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import type { StoreAppProduct, StoreCategory } from '../utils/storeDb';

export const INQUIRY_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  PHONE_MIN: 7,
  PHONE_MAX: 30,
  PHONE_PATTERN: /^[0-9+\-\s()]{7,30}$/,
  INTEREST_MIN: 2,
  INTEREST_MAX: 160,
  MESSAGE_MAX: 1000,
} as const;

export const DOWNLOAD_EVENT_LIMITS = {
  ID_PATTERN: /^[a-zA-Z0-9_-]{1,128}$/,
  TITLE_MIN: 2,
  TITLE_MAX: 160,
  VERSION_MIN: 1,
  VERSION_MAX: 32,
  PLATFORM_MIN: 2,
  PLATFORM_MAX: 100,
} as const;

export interface ProjectInquiryInput {
  name: string;
  phone: string;
  interest: string;
  message: string;
}

export interface InquiryArchiveRecord {
  id: string;
  name: string;
  phone: string;
  interest: string;
  message: string;
  submittedAt: string;
}

export interface SubmitInquiryResult {
  id: string;
  deduplicated: boolean;
}

const INQUIRY_ARCHIVE_STORAGE_KEY = 'myfe_submitted_inquiries_archive_v1';

const VALID_CATEGORIES: StoreCategory[] = [
  'Customs & Logistics ERPs',
  'Advocates Legal Suite',
  'Business Finance',
  'Android / Mobile Apps (APK)',
  'E-Commerce & Delivery Apps',
  'AI Tools & Web Apps',
];

function computeStableHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function buildDeterministicInquiryId(
  name: string,
  phone: string,
  interest: string,
  message: string
): string {
  const dayKey = new Date().toISOString().slice(0, 10);
  const normalizedPhone = phone.replace(/\D/g, '');
  const signature = [
    dayKey,
    name.trim().toLowerCase(),
    normalizedPhone,
    interest.trim().toLowerCase(),
    message.trim().toLowerCase(),
  ].join('|');
  const h1 = computeStableHash(signature);
  const h2 = computeStableHash(signature.split('').reverse().join(''));
  return `inq-${dayKey}-${h1}${h2}`.slice(0, 128);
}

export function loadInquiryArchive(): InquiryArchiveRecord[] {
  try {
    const raw = localStorage.getItem(INQUIRY_ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const clean: InquiryArchiveRecord[] = [];
    for (const row of parsed) {
      if (row && typeof row.id === 'string' && !seen.has(row.id)) {
        seen.add(row.id);
        clean.push({
          id: row.id,
          name: String(row.name || ''),
          phone: String(row.phone || ''),
          interest: String(row.interest || ''),
          message: String(row.message || ''),
          submittedAt: String(row.submittedAt || new Date().toISOString()),
        });
      }
    }
    return clean;
  } catch {
    return [];
  }
}

function saveInquiryArchiveRecord(record: InquiryArchiveRecord): InquiryArchiveRecord[] {
  const existing = loadInquiryArchive();
  const deduped = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, 100);
  try {
    localStorage.setItem(INQUIRY_ARCHIVE_STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    // Ignore storage quota limits gracefully
  }
  return deduped;
}

export async function fetchPublicSoftwareCatalog(): Promise<StoreAppProduct[]> {
  const path = 'software_catalog';
  try {
    const q = query(collection(db, path), where('isPublic', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((docSnap, idx) => {
      const raw = docSnap.data() as Record<string, unknown>;
      const rawCategory = typeof raw.category === 'string' ? raw.category : '';
      const category: StoreCategory = VALID_CATEGORIES.includes(rawCategory as StoreCategory)
        ? (rawCategory as StoreCategory)
        : 'Customs & Logistics ERPs';

      return {
        id: typeof raw.id === 'string' && raw.id ? raw.id : docSnap.id || `prod-${idx + 1}`,
        title: typeof raw.title === 'string' && raw.title ? raw.title : 'Enterprise Software Suite',
        category,
        version: typeof raw.version === 'string' && raw.version ? raw.version : 'v1.0',
        platform:
          typeof raw.platform === 'string' && raw.platform
            ? raw.platform
            : 'Windows / Web / Mobile',
        fileSize: typeof raw.fileSize === 'string' && raw.fileSize ? raw.fileSize : 'Ready Setup',
        downloadsCount: typeof raw.downloadsCount === 'number' ? raw.downloadsCount : 150,
        description: typeof raw.description === 'string' ? raw.description : '',
        features: Array.isArray(raw.features) ? raw.features.map(String) : [],
        demoCredentials: typeof raw.demoCredentials === 'string' ? raw.demoCredentials : undefined,
        trialDuration:
          typeof raw.trialDuration === 'string' ? raw.trialDuration : 'Enterprise Demo Access',
        installInstructions:
          typeof raw.installInstructions === 'string' ? raw.installInstructions : undefined,
        badgeText: typeof raw.badgeText === 'string' ? raw.badgeText : '100% READY ERP',
        publishedAt: typeof raw.publishedAt === 'string' ? raw.publishedAt : '02 Nov 2026',
        requireLogin: false,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function submitProjectInquiry(
  input: ProjectInquiryInput
): Promise<SubmitInquiryResult> {
  const name = input.name.trim().slice(0, INQUIRY_LIMITS.NAME_MAX);
  const phone = input.phone.trim().slice(0, INQUIRY_LIMITS.PHONE_MAX);
  const interest = (input.interest.trim() || 'Enterprise Software Inquiry').slice(
    0,
    INQUIRY_LIMITS.INTEREST_MAX
  );
  const message = input.message.trim().slice(0, INQUIRY_LIMITS.MESSAGE_MAX);

  if (name.length < INQUIRY_LIMITS.NAME_MIN) {
    throw new Error('Please enter your Full Name (at least 2 characters).');
  }
  const digitCount = phone.replace(/\D/g, '').length;
  if (digitCount < 7 || !INQUIRY_LIMITS.PHONE_PATTERN.test(phone)) {
    throw new Error('Please enter a valid WhatsApp / Mobile number (at least 7 digits).');
  }
  if (interest.length < INQUIRY_LIMITS.INTEREST_MIN) {
    throw new Error('Please specify your software or solution interest.');
  }

  const inquiryId = buildDeterministicInquiryId(name, phone, interest, message);
  const existingArchive = loadInquiryArchive();
  if (existingArchive.some((item) => item.id === inquiryId)) {
    return { id: inquiryId, deduplicated: true };
  }

  const path = `inquiries/${inquiryId}`;
  try {
    await setDoc(doc(db, 'inquiries', inquiryId), {
      name,
      phone,
      interest,
      message,
      status: 'new',
      createdAt: serverTimestamp(),
    });
    saveInquiryArchiveRecord({
      id: inquiryId,
      name,
      phone,
      interest,
      message,
      submittedAt: new Date().toISOString(),
    });
    return { id: inquiryId, deduplicated: false };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function recordTrialDownloadEvent(product: StoreAppProduct): Promise<string> {
  const cleanId = DOWNLOAD_EVENT_LIMITS.ID_PATTERN.test(product.id) ? product.id : 'prod-1';
  const productTitle = (product.title.trim() || 'Enterprise Software')
    .slice(0, DOWNLOAD_EVENT_LIMITS.TITLE_MAX)
    .padEnd(DOWNLOAD_EVENT_LIMITS.TITLE_MIN, ' ');
  const version = (product.version.trim() || 'v1.0').slice(0, DOWNLOAD_EVENT_LIMITS.VERSION_MAX);
  const platform = (product.platform.trim() || 'Windows / Web').slice(
    0,
    DOWNLOAD_EVENT_LIMITS.PLATFORM_MAX
  );
  const eventId = `evt-${cleanId}-${Date.now().toString(36)}`.slice(0, 128);
  const path = `download_events/${eventId}`;

  try {
    await setDoc(doc(db, 'download_events', eventId), {
      productId: cleanId,
      productTitle,
      version,
      platform,
      createdAt: serverTimestamp(),
    });
    return eventId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
