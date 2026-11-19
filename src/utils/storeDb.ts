/**
 * Product Catalog Local Persistence Engine for Make Your Fly Easy
 * Stores normalized public software suite metadata in LocalStorage with safe fallback.
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

const STORE_PRODUCTS_KEY = 'myfe_store_products_v2';

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
      'Reads Customs GDs, transport consignment notes, commercial invoices, ID cards, and handwritten receipts straight from a photo or file into organized business records.',
    features: [
      'Snap a photo or pick a document to read bills and clearance files',
      'Extracts party names, item details, dates, and tax totals automatically',
      'Handles handwritten dispatch slips, fuel receipts, and office vouchers',
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
    version: typeof raw.version === 'string' && raw.version ? raw.version : 'Ready Suite',
    platform: typeof raw.platform === 'string' && raw.platform ? raw.platform : 'Office & Mobile Access',
    fileSize: typeof raw.fileSize === 'string' && raw.fileSize ? raw.fileSize : 'Ready Setup',
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
    requireLogin: false,
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
        : 'Schedule a live walkthrough with our Karachi engineering desk via WhatsApp (+92-339-8884124) or Direct Mobile (+93-321-9222883).',
    accentColor:
      raw.accentColor === 'gold' || raw.accentColor === 'cyan' || raw.accentColor === 'emerald'
        ? raw.accentColor
        : 'gold',
  };
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
    // Fallback silently if storage quota is reached
  }
}
