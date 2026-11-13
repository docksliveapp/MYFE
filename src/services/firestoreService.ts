import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
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

const VALID_CATEGORIES: StoreCategory[] = [
  'Customs & Logistics ERPs',
  'Advocates Legal Suite',
  'Business Finance',
  'Android / Mobile Apps (APK)',
  'E-Commerce & Delivery Apps',
  'AI Tools & Web Apps',
];

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
            : 'Windows / Web / Android APK',
        fileSize: typeof raw.fileSize === 'string' && raw.fileSize ? raw.fileSize : '25.0 MB',
        downloadsCount: typeof raw.downloadsCount === 'number' ? raw.downloadsCount : 150,
        description: typeof raw.description === 'string' ? raw.description : '',
        features: Array.isArray(raw.features) ? raw.features.map(String) : [],
        demoCredentials: typeof raw.demoCredentials === 'string' ? raw.demoCredentials : undefined,
        trialDuration:
          typeof raw.trialDuration === 'string' ? raw.trialDuration : '14-Day Full Evaluation Trial',
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

export async function submitProjectInquiry(input: ProjectInquiryInput): Promise<string> {
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
  if (!INQUIRY_LIMITS.PHONE_PATTERN.test(phone)) {
    throw new Error('Please enter a valid WhatsApp / Mobile number (7-30 digits/symbols).');
  }
  if (interest.length < INQUIRY_LIMITS.INTEREST_MIN) {
    throw new Error('Please specify your software or solution interest.');
  }

  const path = 'inquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      name,
      phone,
      interest,
      message,
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
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

  const path = 'download_events';
  try {
    const docRef = await addDoc(collection(db, path), {
      productId: cleanId,
      productTitle,
      version,
      platform,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
