/**
 * IndexedDB + LocalStorage Persistence Engine for Make Your Fly Easy
 * Domain-Based Corporate Marketing, Product Showcase & Demo Portal
 * Stores:
 * 1. Demo Store Products (metadata, features, download counts, access control, external URLs, thumbnail DataURLs)
 * 2. Uploaded Binary Files (APK, ZIP, EXE, PDF blobs stored in IndexedDB `app_files` store)
 * 3. Registered Clients (Name, Company, WhatsApp Mobile, Email, Password, RegisteredAt)
 * 4. Master Admin Settings (Admin Password override, session state)
 */

export type StoreCategory =
  | 'Customs & Logistics ERPs'
  | 'Advocates Legal Suite'
  | 'Business Finance'
  | 'Android / Mobile Apps (APK)'
  | 'E-Commerce & Delivery Apps'
  | 'AI Tools & Web Apps';

export interface StoreAppProduct {
  id: string;
  title: string;
  category: StoreCategory;
  version: string;
  platform: string;
  fileSize: string;
  downloadsCount: number;
  downloads?: number;
  description: string;
  features: string[];
  demoCredentials?: string;
  screenshotUrl?: string;
  thumbnailUrl?: string;
  externalDemoUrl?: string;
  externalDownloadUrl?: string;
  hasBinaryInDb?: boolean;
  hasUploadedBinary?: boolean;
  binaryFileName?: string;
  uploadedFileName?: string;
  uploadedFileMime?: string;
  requireLogin: boolean;
  publishedAt: string;
  updatedAt?: string;
  badgeText?: string;
  trialDuration?: string;
  installInstructions?: string;
  accentColor?: 'gold' | 'cyan' | 'emerald';
}

export interface RegisteredClient {
  id: string;
  fullName: string;
  companyName: string;
  whatsapp: string;
  whatsappNumber?: string;
  email: string;
  password: string;
  registeredAt: string;
  createdAt?: string;
}

export interface ActiveSession {
  role: 'client' | 'admin';
  name: string;
  companyName?: string;
  company?: string;
  email: string;
  whatsapp?: string;
}

const DB_NAME = 'MYFE_Enterprise_Store_DB';
const DB_VERSION = 1;
const STORE_PRODUCTS_KEY = 'myfe_store_products_v2';
const STORE_CLIENTS_KEY = 'myfe_registered_clients_v2';
const STORE_SESSION_KEY = 'myfe_active_session_v2';
const STORE_ADMIN_PASS_KEY = 'myfe_admin_password_v2';

export const DEFAULT_DEMO_PRODUCTS: StoreAppProduct[] = [
  {
    id: 'prod-1',
    title: 'Pakistan Customs Clearing, Bonded Carrier, TIR & ATT Management Software',
    category: 'Customs & Logistics ERPs',
    version: 'Ready Suite',
    platform: 'Office & Mobile Access',
    fileSize: 'Ready Setup',
    downloadsCount: 462,
    description:
      'Manages complete customs clearance jobs, bonded carrier dispatches, TIR international transit, and Afghan Transit Trade (ATT) files along with complete shipment billing and party accounts.',
    features: [
      'Complete job file tracking from port arrival to final delivery',
      'Vehicle, container, customs seal, and route movement records',
      'TIR & Afghan Transit (ATT) border file and manifest handling',
      'Automatic shipment bills, party ledgers, and per-job profit tracking',
    ],
    demoCredentials: 'Live walkthrough available via Karachi Desk',
    requireLogin: false,
    publishedAt: '02 Nov 2026',
    badgeText: '100% READY ERP',
    accentColor: 'emerald',
  },
  {
    id: 'prod-2',
    title: 'Council / Advocates Legal Case & Finance Management Suite',
    category: 'Advocates Legal Suite',
    version: 'Ready Suite',
    platform: 'Office & Mobile Access',
    fileSize: 'Ready Setup',
    downloadsCount: 318,
    description:
      'Organizes all court cases, daily hearing diaries, legal drafts, client files, and chamber fee accounts for advocates and law firms in one structured system.',
    features: [
      'Complete court case registration across Civil, High Court & Supreme Court',
      'Daily court diary and timely hearing reminders for clients',
      'Fast drafting tools for petitions, contracts, and legal notices',
      'Organized client fee installments, retainers, and chamber expenses',
    ],
    demoCredentials: 'Live walkthrough available via Karachi Desk',
    requireLogin: false,
    publishedAt: '02 Nov 2026',
    badgeText: '100% READY SUITE',
    accentColor: 'gold',
  },
  {
    id: 'prod-3',
    title: 'Universal Business Finance & Billing Software',
    category: 'Business Finance',
    version: 'Ready Suite',
    platform: 'Office & Mobile Access',
    fileSize: 'Ready Setup',
    downloadsCount: 540,
    description:
      'Replaces manual registers and scattered spreadsheets by handling daily sales billing, supplier payments, staff expenses, customer balances, and overall business profit for any industry.',
    features: [
      'Clean daily cash, bank, and expense entries with owner approval',
      'Customer sales bills and overdue payment follow-up lists',
      'Instant cashflow, branch balance, and profit/loss overview',
      'Multi-branch access with clear staff permission control',
    ],
    demoCredentials: 'Live walkthrough available via Karachi Desk',
    requireLogin: false,
    publishedAt: '02 Nov 2026',
    badgeText: '100% READY ERP',
    accentColor: 'cyan',
  },
  {
    id: 'prod-4',
    title: 'Smart Document, Customs GD & Receipt Reader',
    category: 'AI Tools & Web Apps',
    version: 'Custom Solution',
    platform: 'Phone Camera & Office Desk',
    fileSize: 'Ready Setup',
    downloadsCount: 389,
    description:
      'Reads Customs GDs, Bilty slips, commercial invoices, ID cards, and handwritten receipts straight from a photo or file into organized business records.',
    features: [
      'Snap a photo or pick a document to read bills and clearance files',
      'Extracts party names, item details, dates, and tax totals automatically',
      'Handles handwritten Bilty slips, fuel receipts, and office vouchers',
      'Saves extracted records cleanly straight into your billing or job files',
    ],
    demoCredentials: 'Live walkthrough available via Karachi Desk',
    requireLogin: false,
    publishedAt: '02 Nov 2026',
    badgeText: 'SMART WORKFLOW',
    accentColor: 'emerald',
  },
  {
    id: 'prod-5',
    title: 'Multi-Vendor Marketplace & Delivery Platform',
    category: 'E-Commerce & Delivery Apps',
    version: 'Custom Solution',
    platform: 'Web & Mobile Friendly',
    fileSize: 'Ready Setup',
    downloadsCount: 276,
    description:
      'Connects customers, partner stores or restaurants, and delivery riders in one branded system with automatic commission calculation and live delivery updates.',
    features: [
      'Customer shopping portal with offers, cart, and order updates',
      'Seller and restaurant dashboard for products, orders, and payouts',
      'Rider dispatch tracking and daily cash-on-delivery settlement',
      'Owner control for seller commissions, delivery zones, and reports',
    ],
    demoCredentials: 'Live walkthrough available via Karachi Desk',
    requireLogin: false,
    publishedAt: '02 Nov 2026',
    badgeText: 'COMPLETE COMMERCE',
    accentColor: 'gold',
  },
];

function normalizeProduct(raw: Partial<StoreAppProduct>, idx: number): StoreAppProduct {
  const rawDownloads =
    typeof raw.downloadsCount === 'number'
      ? raw.downloadsCount
      : typeof raw.downloads === 'number'
      ? raw.downloads
      : 150;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `prod-${idx + 1}`,
    title: typeof raw.title === 'string' && raw.title ? raw.title : 'Enterprise Software Suite',
    category: (raw.category as StoreCategory) || 'Customs & Logistics ERPs',
    version: typeof raw.version === 'string' && raw.version ? raw.version : 'v1.0',
    platform: typeof raw.platform === 'string' && raw.platform ? raw.platform : 'Windows / Web / Android APK',
    fileSize: typeof raw.fileSize === 'string' && raw.fileSize ? raw.fileSize : '25.0 MB',
    downloadsCount: rawDownloads,
    downloads: rawDownloads,
    description: typeof raw.description === 'string' ? raw.description : '',
    features: Array.isArray(raw.features) ? raw.features.map(String) : [],
    demoCredentials: typeof raw.demoCredentials === 'string' ? raw.demoCredentials : undefined,
    screenshotUrl:
      typeof raw.screenshotUrl === 'string'
        ? raw.screenshotUrl
        : typeof raw.thumbnailUrl === 'string'
        ? raw.thumbnailUrl
        : undefined,
    externalDemoUrl:
      typeof raw.externalDemoUrl === 'string'
        ? raw.externalDemoUrl
        : typeof raw.externalDownloadUrl === 'string'
        ? raw.externalDownloadUrl
        : undefined,
    hasBinaryInDb: Boolean(raw.hasBinaryInDb || raw.hasUploadedBinary),
    binaryFileName:
      typeof raw.binaryFileName === 'string'
        ? raw.binaryFileName
        : typeof raw.uploadedFileName === 'string'
        ? raw.uploadedFileName
        : undefined,
    requireLogin: Boolean(raw.requireLogin),
    publishedAt:
      typeof raw.publishedAt === 'string'
        ? raw.publishedAt
        : typeof raw.updatedAt === 'string'
        ? raw.updatedAt
        : '02 Nov 2026',
    badgeText: typeof raw.badgeText === 'string' ? raw.badgeText : '100% READY ERP',
    trialDuration:
      typeof raw.trialDuration === 'string' && raw.trialDuration
        ? raw.trialDuration
        : 'Enterprise Deployment Ready',
    installInstructions:
      typeof raw.installInstructions === 'string' && raw.installInstructions
        ? raw.installInstructions
        : '1. Review included modules and operational workflows.\n2. Schedule a live walkthrough with our Karachi engineering desk.\n3. Contact +92-339-8884124 on WhatsApp or +93-321-9222883 for full deployment.',
    accentColor:
      raw.accentColor === 'gold' || raw.accentColor === 'cyan' || raw.accentColor === 'emerald'
        ? raw.accentColor
        : 'gold',
  };
}

function normalizeClient(raw: Partial<RegisteredClient>, idx: number): RegisteredClient {
  const whatsappVal =
    typeof raw.whatsapp === 'string'
      ? raw.whatsapp
      : typeof raw.whatsappNumber === 'string'
      ? raw.whatsappNumber
      : '';
  const regDate =
    typeof raw.registeredAt === 'string'
      ? raw.registeredAt
      : typeof raw.createdAt === 'string'
      ? raw.createdAt
      : '02 Nov 2026';

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `client-${idx + 1}`,
    fullName: typeof raw.fullName === 'string' ? raw.fullName : 'Verified Client',
    companyName: typeof raw.companyName === 'string' ? raw.companyName : 'Enterprise Client',
    whatsapp: whatsappVal,
    whatsappNumber: whatsappVal,
    email: typeof raw.email === 'string' ? raw.email : '',
    password: typeof raw.password === 'string' ? raw.password : '',
    registeredAt: regDate,
    createdAt: regDate,
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('app_files')) {
        db.createObjectStore('app_files', { keyPath: 'appId' });
      }
      if (!db.objectStoreNames.contains('kv_store')) {
        db.createObjectStore('kv_store', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBinaryFileToDb(
  appId: string,
  fileOrName: File | string,
  mimeType?: string,
  blob?: Blob
): Promise<void> {
  const db = await openDatabase();
  const resolvedFileName =
    typeof fileOrName === 'string' ? fileOrName : fileOrName.name || `${appId}-installer.zip`;
  const resolvedMime =
    typeof fileOrName === 'string'
      ? mimeType || 'application/octet-stream'
      : fileOrName.type || 'application/octet-stream';
  const resolvedBlob: Blob = typeof fileOrName === 'string' ? blob || new Blob([]) : fileOrName;

  return new Promise((resolve, reject) => {
    const tx = db.transaction('app_files', 'readwrite');
    const store = tx.objectStore('app_files');
    store.put({
      appId,
      fileName: resolvedFileName,
      mimeType: resolvedMime,
      blob: resolvedBlob,
      savedAt: new Date().toISOString(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBinaryFileFromDb(
  appId: string
): Promise<{ fileName: string; mimeType: string; blob: Blob } | null> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('app_files', 'readonly');
      const store = tx.objectStore('app_files');
      const req = store.get(appId);
      req.onsuccess = () => {
        if (req.result) {
          resolve({
            fileName: req.result.fileName,
            mimeType: req.result.mimeType,
            blob: req.result.blob,
          });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function deleteBinaryFileFromDb(appId: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('app_files', 'readwrite');
      const store = tx.objectStore('app_files');
      store.delete(appId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore if DB unavailable
  }
}

export function loadProductsFromStorage(): StoreAppProduct[] {
  try {
    const raw = localStorage.getItem(STORE_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(STORE_PRODUCTS_KEY, JSON.stringify(DEFAULT_DEMO_PRODUCTS));
      return DEFAULT_DEMO_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const countMap = new Map<string, number>();
      parsed.forEach((item) => {
        if (item && typeof item.id === 'string' && typeof item.downloadsCount === 'number') {
          countMap.set(item.id, item.downloadsCount);
        }
      });
      return DEFAULT_DEMO_PRODUCTS.map((def, idx) =>
        normalizeProduct(
          {
            ...def,
            downloadsCount: countMap.get(def.id) ?? def.downloadsCount,
          },
          idx
        )
      );
    }
    return DEFAULT_DEMO_PRODUCTS;
  } catch {
    return DEFAULT_DEMO_PRODUCTS;
  }
}

export function saveProductsToStorage(products: StoreAppProduct[]): void {
  try {
    const normalized = products.map((p, idx) => normalizeProduct(p, idx));
    localStorage.setItem(STORE_PRODUCTS_KEY, JSON.stringify(normalized));
  } catch {
    // Fallback if quota reached
  }
}

export function loadClientsFromStorage(): RegisteredClient[] {
  try {
    const raw = localStorage.getItem(STORE_CLIENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((c, idx) => normalizeClient(c, idx)) : [];
  } catch {
    return [];
  }
}

export function saveClientsToStorage(clients: RegisteredClient[]): void {
  try {
    const normalized = clients.map((c, idx) => normalizeClient(c, idx));
    localStorage.setItem(STORE_CLIENTS_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore
  }
}

export function loadSessionFromStorage(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(STORE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSessionToStorage(session: ActiveSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(STORE_SESSION_KEY);
    } else {
      localStorage.setItem(STORE_SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore
  }
}

export function getAdminPassword(): string {
  try {
    return localStorage.getItem(STORE_ADMIN_PASS_KEY) || 'MYFE@786';
  } catch {
    return 'MYFE@786';
  }
}

export function setAdminPassword(newPass: string): void {
  try {
    localStorage.setItem(STORE_ADMIN_PASS_KEY, newPass);
  } catch {
    // Ignore
  }
}

/**
 * Builds the direct deep-link URL for a specific product (for Social Media Ads & Boosts)
 */
export function buildProductBoostUrl(productId: string): string {
  if (typeof window === 'undefined') {
    return `https://myfe.org/?product=${encodeURIComponent(productId)}`;
  }
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?product=${encodeURIComponent(productId)}`;
}

/**
 * Generates a high-converting Social Media Ad Caption
 * for Facebook, Instagram, LinkedIn, TikTok, and WhatsApp Campaigns.
 */
export function generateSocialAdCaption(product: StoreAppProduct): string {
  const directUrl = buildProductBoostUrl(product.id);
  const safeFeatures = Array.isArray(product.features) ? product.features : [];
  return `🚀 ${product.title.toUpperCase()} (${product.version}) — 100% READY FOR DEPLOYMENT!

Looking to digitize and scale your business operations with Pakistan's Premier Enterprise Software House?
Make Your Fly Easy brings you ${product.title} — engineered for speed, accuracy, and complete financial & operational control.

✅ Key Highlights & Modules:
${safeFeatures.map((f) => `• ${f}`).join('\n')}

💻 Platform: ${product.platform}
⚡ Status: Ready for Instant Setup & Live Customization!
🔗 View Suite Details:
👉 ${directUrl}

📞 Book Your Live Demo on WhatsApp / Call:
📲 WhatsApp: +92-339-8884124 (https://wa.me/923398884124)
📱 Direct Mobile: +93-321-9222883 | Landline: 021-36601055
📧 Email: info@myfe.org | 🌐 Web: myfe.org
🏢 Head Office: Office Number 13, First Floor, State Life Building Number 7, G. Allana Road, Tower, Karachi, Pakistan.

#MakeYourFlyEasy #EnterpriseSoftware #PakistanCustoms #LogisticsERP #LegalTechPakistan #BusinessFinance #CustomAppDevelopment #KarachiTech #SoftwareHousePakistan`;
}

/**
 * Generates an interactive standalone Demo Package HTML launcher file
 * when a visitor clicks "Download & Test Demo" on a product without a custom binary upload.
 */
export function generateDemoPackageHtml(product: StoreAppProduct): string {
  const safeFeatures = Array.isArray(product.features) ? product.features : [];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${product.title} (${product.version}) — Make Your Fly Easy Official Demo Package</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: radial-gradient(circle at top left, rgba(167, 139, 250, 0.18), transparent 55%), #F8F7FC;
      color: #141129;
      margin: 0;
      padding: 40px 20px;
    }
    .card {
      max-width: 780px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(124, 58, 237, 0.22);
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 20px 50px rgba(46, 16, 101, 0.08);
    }
    .badge {
      display: inline-block;
      background: rgba(124, 58, 237, 0.1);
      color: #6D28D9;
      font-weight: 700;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 8px;
      letter-spacing: 0.06em;
    }
    h1 { font-size: 26px; margin: 16px 0 8px; color: #141129; }
    .meta { font-family: monospace; font-size: 13px; color: #5B5480; margin-bottom: 20px; }
    .box {
      background: #F4F1FC;
      border: 1px solid rgba(124, 58, 237, 0.28);
      padding: 16px;
      border-radius: 12px;
      margin: 20px 0;
      font-family: monospace;
      font-size: 13px;
      color: #2E1065;
    }
    ul { line-height: 1.8; color: #362F5A; }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #6D28D9, #7C3AED);
      color: #FFFFFF;
      text-decoration: none;
      padding: 14px 24px;
      border-radius: 12px;
      font-weight: 700;
      margin-top: 20px;
      box-shadow: 0 10px 24px rgba(109, 40, 217, 0.35);
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">${product.trialDuration || 'TRIAL DEMO EDITION'} · MAKE YOUR FLY EASY</span>
    <h1>${product.title}</h1>
    <div class="meta">Version: ${product.version} | Platform: ${product.platform} | Category: ${product.category}</div>
    <p>${product.description}</p>
    <div class="box">
      <strong>Trial Activation &amp; Login Credentials:</strong><br/>
      ${product.demoCredentials || 'Instant Trial Sandbox Activated (No Key Required)'}
    </div>
    ${
      product.installInstructions
        ? `<div class="box"><strong>Installation &amp; Testing Steps:</strong><br/>${product.installInstructions.replace(
            /\n/g,
            '<br/>'
          )}</div>`
        : ''
    }
    <h3>Included Enterprise Modules &amp; Capabilities:</h3>
    <ul>
      ${safeFeatures.map((f) => `<li>${f}</li>`).join('')}
    </ul>
    <hr style="border:none; border-top:1px solid #E9E4F7; margin:24px 0;" />
    <p style="font-size:14px; color:#4C456E;">
      <strong>Make Your Fly Easy — Enterprise Software House &amp; Custom App Studio</strong><br/>
      Office Number 13, First Floor, State Life Building Number 7, G. Allana Road, Tower, Karachi, Pakistan.<br/>
      Direct Mobile: +93-321-9222883 | WhatsApp: +92-339-8884124 | Landline: 021-36601055 | Email: info@myfe.org | Web: myfe.org
    </p>
    <a class="btn" href="https://wa.me/923398884124?text=${encodeURIComponent(
      `Assalam-o-Alaikum Make Your Fly Easy, I would like a live walkthrough and commercial activation for ${product.title} (${product.version}).`
    )}">Request Live Demo on WhatsApp →</a>
  </div>
</body>
</html>`;
}
