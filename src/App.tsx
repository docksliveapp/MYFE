import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Briefcase,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Cpu,
  Eye,
  FileCheck2,
  FileSearch,
  Globe,
  Layers,
  Lock,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Phone,
  Scale,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Utensils,
  X,
} from 'lucide-react';
import { RoyalLogo } from './components/RoyalLogo';
import { LegalSecurityModal, LegalTab } from './components/LegalSecurityModal';
import {
  loadProductsFromStorage,
  saveProductsToStorage,
  StoreAppProduct,
} from './utils/storeDb';
import {
  fetchPublicSoftwareCatalog,
  INQUIRY_LIMITS,
  submitProjectInquiry,
} from './services/firestoreService';

const WHATSAPP_NUMBER = '923398884124';
const WHATSAPP_DISPLAY = '+92-339-8884124';
const DIRECT_MOBILE_DISPLAY = '+93-321-9222883';
const DIRECT_MOBILE_TEL = '+933219222883';
const LANDLINE_DISPLAY = '021-36601055';
const LANDLINE_TEL = '+922136601055';
const EMAIL_ADDRESS = 'info@myfe.org';
const WEBSITE_DISPLAY = 'myfe.org';
const WEBSITE_URL = 'https://myfe.org';
const OFFICE_ADDRESS =
  'Office Number 13, First Floor, State Life Building Number 7, G. Allana Road, Tower, Karachi, Pakistan.';

function openExternalSafely(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

interface ReadySuiteGuide {
  id: string;
  suiteLabel: string;
  title: string;
  whatItDoes: string;
  howItWorks: string;
  benefits: string[];
  icon: React.ReactNode;
}

const READY_SUITES: ReadySuiteGuide[] = [
  {
    id: 'prod-1',
    suiteLabel: 'Suite 01 · Customs & Logistics',
    title: 'Pakistan Customs, Bonded Carrier, TIR & ATT Management Software',
    whatItDoes:
      'Manages complete customs clearance jobs, bonded carrier dispatches, TIR international transit, and Afghan Transit Trade (ATT) files along with complete shipment billing and party accounts.',
    howItWorks:
      'Your team enters a job or GD file once, updates each clearance and border checkpoint as the shipment moves, and records vehicle and port expenses directly against that job. Bills and party balances update automatically.',
    benefits: [
      'Track every consignment from port arrival to final delivery without missing files',
      'Know the exact profit or loss on every single job and container instantly',
      'Eliminate unbilled port or transport expenses and speed up party recoveries',
    ],
    icon: <Truck className="w-5 h-5 text-violet-700" />,
  },
  {
    id: 'prod-2',
    suiteLabel: 'Suite 02 · Law Chambers',
    title: 'Advocates & Law Firm Management Software',
    whatItDoes:
      'Organizes all court cases, daily hearing diaries, legal drafts, client files, and chamber fee accounts for advocates and law firms in one structured system.',
    howItWorks:
      'Register each client suit once, update hearing dates from your daily court diary, and keep case papers attached to the client file. Clients receive timely hearing updates while fee installments stay tracked automatically.',
    benefits: [
      'Never miss a court date, hearing update, or pending case deadline',
      'Find any client petition, previous order, or fee history in seconds',
      'Save hours of manual diary writing and stay on top of retainer receivables',
    ],
    icon: <Scale className="w-5 h-5 text-violet-700" />,
  },
  {
    id: 'prod-3',
    suiteLabel: 'Suite 03 · Business Finance',
    title: 'Universal Business Finance & Billing Software',
    whatItDoes:
      'Replaces manual registers and scattered spreadsheets by handling daily sales billing, supplier payments, staff expenses, customer balances, and overall business profit for any industry.',
    howItWorks:
      'Your staff enters daily receipts, payments, and invoices in clean, guided screens. The software automatically calculates customer dues, supplier balances, cash in hand, and monthly profit.',
    benefits: [
      'See today’s cash position, pending recoveries, and true business profit at a glance',
      'Prevent calculation mistakes, duplicate entries, and missing payment records',
      'Monitor multiple branches and staff permissions from a single executive view',
    ],
    icon: <Calculator className="w-5 h-5 text-violet-700" />,
  },
];

interface BuildCapability {
  num: string;
  title: string;
  category: string;
  whatItDoes: string;
  howItWorks: string;
  benefits: string[];
  icon: React.ReactNode;
}

const BUILD_CAPABILITIES: BuildCapability[] = [
  {
    num: '01',
    title: 'Business Websites & Interactive Portals',
    category: 'Websites & Online Presence',
    whatItDoes:
      'Presents your company, services, catalogs, and instant quote calculators in a fast, modern website built to bring in inquiries.',
    howItWorks:
      'Visitors explore your services clearly on mobile or desktop, calculate estimates or book appointments, and message your team in one tap.',
    benefits: [
      'Builds instant credibility and trust with local and international clients',
      'Turns daily website visitors into direct WhatsApp and phone leads',
    ],
    icon: <Globe className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '02',
    title: 'Multi-Vendor Online Marketplace',
    category: 'Online Shopping & Sellers',
    whatItDoes:
      'Allows multiple shops and sellers to list and sell their products together on your branded marketplace.',
    howItWorks:
      'Sellers upload products, customers place orders online, and the system automatically splits earnings, commissions, and courier tracking.',
    benefits: [
      'Earn commission on every seller’s order automatically',
      'Grow a large product catalog without holding all inventory yourself',
    ],
    icon: <ShoppingBag className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '03',
    title: 'Branded Retail Online Store',
    category: 'Direct Business Sales',
    whatItDoes:
      'Gives your brand its own professional online shop so customers can browse and buy directly from you 24/7.',
    howItWorks:
      'Customers pick items, choose cash or online payment, and receive instant WhatsApp order updates while stock adjusts automatically.',
    benefits: [
      'Accept orders around the clock even after shop closing hours',
      'Turn visitors into repeat buyers with loyalty offers and smooth checkout',
    ],
    icon: <Sparkles className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '04',
    title: 'On-Demand Food & Parcel Delivery',
    category: 'Delivery & Riders',
    whatItDoes:
      'Connects customers, partner stores or kitchens, and delivery riders for fast doorstep delivery.',
    howItWorks:
      'Customers order from nearby stores, the nearest rider accepts the pickup, and cash-on-delivery settlements update in real time.',
    benefits: [
      'Faster deliveries with zero phone-call confusion',
      'Clear daily tracking of every rider’s completed trips and cash collection',
    ],
    icon: <Utensils className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '05',
    title: 'Custom Dashboards, CRM & Office Portals',
    category: 'Industry & Team Apps',
    whatItDoes:
      'Builds custom management apps for sales teams, clinics, schools, factories, real estate, or service offices—tailored around your exact workflow.',
    howItWorks:
      'Staff log daily tasks, follow-ups, attendance, or stock from phone or computer while owners view live branch performance from anywhere.',
    benefits: [
      'Replaces messy WhatsApp groups and spreadsheets with one organized hub',
      'Keeps every department accountable with clear daily progress visibility',
    ],
    icon: <Briefcase className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '06',
    title: 'Custom Company Accounting & Billing',
    category: 'Finance & Accounts',
    whatItDoes:
      'Tailors your invoicing, daily expenses, payroll, and customer aging records around how your business actually works.',
    howItWorks:
      'Every bill, salary, or payment entered by your office immediately updates customer statements and management profit summaries.',
    benefits: [
      'Follow up on overdue payments faster with automatic aging alerts',
      'Save hours at month-end closing with ready-to-read reports',
    ],
    icon: <Calculator className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '07',
    title: 'Live Vehicle & Fleet Tracking',
    category: 'Transport & Cargo',
    whatItDoes:
      'Shows the live movement, route discipline, fuel usage, and trip costs of every truck or field vehicle.',
    howItWorks:
      'Vehicles appear on a live map from departure to arrival; managers get alerts on delays or route changes and log trip expenses in one place.',
    benefits: [
      'Stop unauthorized stops, fuel wastage, and delivery delays',
      'Give corporate clients accurate cargo location and arrival updates',
    ],
    icon: <Map className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '08',
    title: 'Smart Document, Invoice & Photo Reader',
    category: 'Paperless Office Work',
    whatItDoes:
      'Reads Customs GDs, Bilty slips, commercial invoices, IDs, and handwritten receipts straight into organized digital records.',
    howItWorks:
      'Your staff simply snaps a photo or selects a PDF file; the software pulls out names, dates, items, and amounts ready to review and save.',
    benefits: [
      'Cut down slow manual typing and human data-entry errors',
      'Process stacks of shipment or office paperwork in minutes',
    ],
    icon: <Eye className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '09',
    title: '24/7 Smart Customer & Sales Assistant',
    category: 'Automated Client Care',
    whatItDoes:
      'Greets every visitor or client inquiry day and night in natural Urdu, English, or Arabic, answers service questions, and captures leads.',
    howItWorks:
      'Clients chat naturally, receive accurate prices, booking slots, or status updates instantly, and qualified leads reach your sales desk.',
    benefits: [
      'Never lose a late-night or busy-hour customer inquiry again',
      'Reduce repetitive phone calls so staff focus on closing deals',
    ],
    icon: <Bot className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '10',
    title: 'Company Knowledge Search & Report Writer',
    category: 'Smart Office Intelligence',
    whatItDoes:
      'Finds instant answers across your company manuals, rate cards, and past files, and prepares clean daily summaries or client proposals.',
    howItWorks:
      'Ask a question in plain language or select recent records; the software pulls exact information and formats ready-to-share reports.',
    benefits: [
      'Staff find company policies, tariffs, and client history in seconds',
      'Management receives crisp daily performance briefs and quotations fast',
    ],
    icon: <FileSearch className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '11',
    title: 'Voice Notes, Meeting Summaries & Audio Tools',
    category: 'Voice & Multilingual Work',
    whatItDoes:
      'Turns Urdu and English voice messages, staff updates, and client meetings into clean written notes, action lists, and follow-up drafts.',
    howItWorks:
      'Record or upload an audio clip or meeting; the tool writes clear key points, assigns next steps, and prepares summaries for your team.',
    benefits: [
      'Save managers from listening to long voice notes repeatedly',
      'Ensure important verbal instructions and commitments are never forgotten',
    ],
    icon: <Mic className="w-5 h-5 text-violet-700" />,
  },
  {
    num: '12',
    title: 'Legal Drafting, Marketing Copy & Brand Visuals',
    category: 'Documents & Creative Studio',
    whatItDoes:
      'Helps chambers and companies prepare structured legal notices, contracts, ad campaigns, product catalogs, and promotional banners rapidly.',
    howItWorks:
      'Share your facts, product details, or campaign goal; the system produces clean drafts, persuasive descriptions, and brand-matched graphics.',
    benefits: [
      'Launch marketing campaigns and urgent office documents in hours, not weeks',
      'Keep uniform, high-end quality across every client file and social post',
    ],
    icon: <FileCheck2 className="w-5 h-5 text-violet-700" />,
  },
];

const ProductBannerArt: React.FC<{
  product: StoreAppProduct;
  failedImage: boolean;
  onImageError: () => void;
}> = ({ product, failedImage, onImageError }) => {
  if (product.screenshotUrl && !failedImage) {
    return (
      <div className="relative h-44 w-full overflow-hidden border-b border-violet-200/60 bg-violet-50">
        <img
          src={product.screenshotUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={onImageError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/55 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold tracking-wider text-violet-900 border border-violet-200">
          {product.badgeText || '100% READY ERP'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-36 w-full overflow-hidden border-b border-violet-200/60 bg-gradient-to-br from-[#F4F0FF] via-[#FFFFFF] to-[#EAE2FF] p-5 flex flex-col justify-between">
      <div
        className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-55 blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.38), transparent 70%)' }}
      />
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="rounded-lg bg-white/85 backdrop-blur-md border border-violet-300/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-800 shadow-xs">
          100% Ready Business Software
        </span>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700/80">
            {product.category}
          </p>
          <p className="mt-0.5 text-sm font-bold text-[#141129] line-clamp-1">
            Practical Overview · How It Works &amp; Benefits
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/90 border border-violet-200 shadow-sm flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-violet-700" />
        </div>
      </div>
    </div>
  );
};

export function App() {
  const [products, setProducts] = useState<StoreAppProduct[]>(() => loadProductsFromStorage());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // ERP Details & Legal Spotlight modals
  const [spotlightProduct, setSpotlightProduct] = useState<StoreAppProduct | null>(null);
  const [spotlightSuite, setSpotlightSuite] = useState<ReadySuiteGuide | null>(null);
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);

  useEffect(() => {
    const syncPolicyFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const policyParam = params.get('policy');
      const hash = window.location.hash.toLowerCase();
      if (policyParam === 'privacy' || hash === '#privacy-policy') {
        setLegalTab('privacy');
      } else if (policyParam === 'terms' || hash === '#terms-conditions') {
        setLegalTab('terms');
      } else if (policyParam === 'security' || hash === '#security-rules') {
        setLegalTab('security');
      }
    };
    syncPolicyFromUrl();
    window.addEventListener('hashchange', syncPolicyFromUrl);
    return () => window.removeEventListener('hashchange', syncPolicyFromUrl);
  }, []);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactInterest, setContactInterest] = useState(
    'Pakistan Customs, Bonded Carrier & TIR ERP'
  );
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Toast feedback & copied key state
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(
    null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ type, text });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Persist products in LocalStorage
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  // Sync any published software items stored in Firestore software_catalog
  useEffect(() => {
    let active = true;
    void fetchPublicSoftwareCatalog()
      .then((remoteItems) => {
        if (!active || remoteItems.length === 0) return;
        setProducts((prev) => {
          const prevMap = new globalThis.Map<string, StoreAppProduct>(
            prev.map((item) => [item.id, item])
          );
          remoteItems.forEach((remote) => {
            const existing = prevMap.get(remote.id);
            prevMap.set(remote.id, {
              ...(existing || remote),
              ...remote,
              downloadsCount: Math.max(existing?.downloadsCount ?? 0, remote.downloadsCount ?? 0),
            });
          });
          return Array.from(prevMap.values());
        });
      })
      .catch(() => {
        // Fallback silently to bundled catalog while FirestoreErrorInfo logs diagnostics
      });
    return () => {
      active = false;
    };
  }, []);

  // Deep-link ?product=ID spotlight check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('product');
    if (pid) {
      const matchedSuite = READY_SUITES.find((s) => s.id === pid);
      if (matchedSuite) {
        setSpotlightSuite(matchedSuite);
        return;
      }
      const found = products.find((p) => p.id === pid);
      if (found) {
        setSpotlightProduct(found);
      }
    }
  }, [products]);

  // Subtle mouse-tracked glass spotlight
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('.glass-surface') as
        | HTMLElement
        | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const navigateToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    window.history.replaceState(null, '', `#${sectionId}`);
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  const handleCopyText = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(`${label} copied to clipboard.`);
      window.setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      showToast('Copy not supported in this browser; please select manually.', 'info');
    }
  };

  const handleRequestCustomBuild = (capabilityTitle: string) => {
    setContactInterest(capabilityTitle);
    setContactMessage(
      `Assalam-o-Alaikum, we would like a live walkthrough and details for ${capabilityTitle}.`
    );
    setSpotlightProduct(null);
    setSpotlightSuite(null);
    navigateToSection('contact');
    showToast(`Prefilled inquiry form for "${capabilityTitle}".`, 'info');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingInquiry) return;
    setContactFeedback(null);

    const name = contactName.trim();
    const phone = contactPhone.trim();
    const digits = phone.replace(/\D/g, '');
    if (name.length < INQUIRY_LIMITS.NAME_MIN || digits.length < 7 || !INQUIRY_LIMITS.PHONE_PATTERN.test(phone)) {
      setContactFeedback({
        type: 'error',
        text: 'Please enter your Full Name (2+ characters) and a valid WhatsApp / Mobile number.',
      });
      return;
    }

    setIsSubmittingInquiry(true);
    try {
      await submitProjectInquiry({
        name,
        phone,
        interest: contactInterest,
        message: contactMessage,
      });

      const text = `Assalam-o-Alaikum Make Your Fly Easy!\nName: ${name}\nPhone: ${phone}\nInterest: ${contactInterest}\nBrief: ${
        contactMessage.trim() || 'Requesting live demo & proposal.'
      }`;

      setContactFeedback({
        type: 'success',
        text: 'Inquiry recorded securely! Opening direct WhatsApp line with our Karachi engineering desk.',
      });
      setContactName('');
      setContactPhone('');
      setContactMessage('');
      openExternalSafely(buildWhatsAppUrl(text));
    } catch {
      setContactFeedback({
        type: 'error',
        text: 'Could not record inquiry cleanly. Please connect directly via WhatsApp below.',
      });
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="min-h-screen pearl-purple-canvas relative text-[#141129] selection:bg-violet-600/20 selection:text-violet-950">
      {/* Ambient Lavender & Royal Purple Refraction Orbs Behind Glass */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <div
          className="ambient-orb w-[420px] h-[420px] -top-24 -left-24 bg-violet-400/25"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="ambient-orb w-[380px] h-[380px] top-[28%] -right-24 bg-purple-400/22"
          style={{ animationDelay: '-5s' }}
        />
        <div
          className="ambient-orb w-[460px] h-[460px] bottom-[-140px] left-[22%] bg-fuchsia-300/20"
          style={{ animationDelay: '-10s' }}
        />
        <div className="absolute inset-0 bg-pearl-grid opacity-80" />
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 right-5 z-50 max-w-sm glass-surface rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl border border-violet-300/70">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-violet-700 shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-semibold text-[#1E1B4B]">{toast.text}</p>
        </div>
      )}

      {/* STICKY GLASS HEADER (PURE WEBSITE — NO LOGIN / SIGN UP / ADMIN PORTAL) */}
      <header className="sticky top-0 z-40 border-b border-violet-200/60 bg-white/75 backdrop-blur-2xl shadow-[0_6px_30px_-10px_rgba(46,16,101,0.09)]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 h-16 sm:h-[74px] flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Non-truncating Royal Logo + Wordmark */}
          <button
            type="button"
            onClick={() => navigateToSection('home')}
            className="group flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 xl:flex-initial text-left cursor-pointer"
          >
            <RoyalLogo idSuffix="nav" className="h-8 sm:h-9 w-auto shrink-0" />
            <div className="min-w-0 h-8 sm:h-9 flex flex-col justify-between py-[1px]">
              <div className="font-display font-extrabold text-[15px] sm:text-[18px] leading-none tracking-tight text-royal-purple whitespace-nowrap">
                MAKE YOUR FLY EASY
              </div>
              <div className="text-[8.5px] sm:text-[10.5px] leading-none font-semibold uppercase tracking-[0.11em] text-[#5B5480] whitespace-nowrap">
                Custom Apps · ERPs · Websites · Smart Tools
              </div>
            </div>
          </button>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#3B3561]">
            <button
              type="button"
              onClick={() => navigateToSection('home')}
              className="text-violet-700 font-bold transition-colors whitespace-nowrap cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('ready-softwares')}
              className="hover:text-violet-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Ready ERPs
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('what-we-build')}
              className="hover:text-violet-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Capabilities
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('about-skills')}
              className="hover:text-violet-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('contact')}
              className="hover:text-violet-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Clean Website Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigateToSection('ready-softwares')}
              className="btn-standard-glass rounded-xl px-3.5 py-2 text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-violet-700" />
              Ready ERPs
            </button>
            <a
              href={buildWhatsAppUrl(
                'Assalam-o-Alaikum Make Your Fly Easy, I would like a live consultation.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-standard-primary rounded-xl px-3.5 py-2 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Menu"
            className="md:hidden btn-standard-glass rounded-xl p-2 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Glass Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-violet-200/60 bg-white/92 backdrop-blur-2xl px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#2E2759]">
              <button
                type="button"
                onClick={() => navigateToSection('home')}
                className="glass-inner-tile rounded-xl px-3 py-2.5 flex items-center justify-between text-left"
              >
                Home
                <ChevronRight className="w-3.5 h-3.5 text-violet-600" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('ready-softwares')}
                className="glass-inner-tile rounded-xl px-3 py-2.5 flex items-center justify-between text-left font-bold text-violet-800"
              >
                Ready ERPs
                <ChevronRight className="w-3.5 h-3.5 text-violet-700" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('what-we-build')}
                className="glass-inner-tile rounded-xl px-3 py-2.5 flex items-center justify-between text-left"
              >
                Capabilities
                <ChevronRight className="w-3.5 h-3.5 text-violet-600" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('about-skills')}
                className="glass-inner-tile rounded-xl px-3 py-2.5 flex items-center justify-between text-left"
              >
                About Us
                <ChevronRight className="w-3.5 h-3.5 text-violet-600" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('contact')}
                className="col-span-2 glass-inner-tile rounded-xl px-3 py-2.5 flex items-center justify-between text-left"
              >
                Contact Karachi HQ
                <ChevronRight className="w-3.5 h-3.5 text-violet-600" />
              </button>
            </div>

            <a
              href={buildWhatsAppUrl(
                'Assalam-o-Alaikum Make Your Fly Easy, I want to book a software demo.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-standard-primary rounded-xl px-4 py-2.5 text-xs w-full"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Consultation
            </a>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO SECTION — LARGE LOGO ON TOP, COMPANY NAME, AND FULL INTRODUCTION */}
        <section id="home" className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-16">
          <div className="glass-surface rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14 text-center flex flex-col items-center">
            {/* Top Centered Large Official Logo */}
            <RoyalLogo
              idSuffix="hero"
              className="h-24 sm:h-28 md:h-32 w-auto drop-shadow-[0_12px_28px_rgba(109,40,217,0.22)]"
            />

            {/* Company Name & Tagline Directly Below Logo */}
            <div className="mt-5 space-y-2">
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-royal-purple leading-none">
                MAKE YOUR FLY EASY
              </h1>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                Complete Digital &amp; AI Business Studio · Karachi HQ
              </p>
            </div>

            <div className="w-24 h-1 rounded-full bg-gradient-to-r from-violet-400 via-purple-600 to-violet-400 my-6 opacity-75" />

            {/* Full Company Introduction Below Company Name */}
            <div className="max-w-3xl space-y-4">
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#141129] leading-snug">
                Everything Your Business Needs Digitally —{' '}
                <span className="text-royal-purple">Built Under One Roof</span>
              </h2>

              <p className="body-fluid-copy text-[#47416A]">
                Make Your Fly Easy is a Karachi-based software and digital solutions studio that
                handles every kind of business automation—from ready-to-use industry systems for{' '}
                <strong className="text-[#1E1B4B]">
                  Pakistan Customs Clearing Agents, Bonded Carriers, TIR &amp; Afghan Transit Trade
                  (ATT), Advocates &amp; Law Chambers,
                </strong>{' '}
                and <strong className="text-[#1E1B4B]">Universal Business Finance</strong> to
                complete custom websites, mobile-friendly apps, and online stores.
              </p>

              <p className="body-fluid-copy text-[#47416A]">
                Whatever digital tool your business imagines—interactive web portals, multi-vendor
                marketplaces, delivery &amp; fleet tracking apps, 24/7 Urdu &amp; English customer
                assistants, smart receipt &amp; document readers, voice-to-notes workflows, custom
                reports, or marketing copy &amp; brand visuals—Make Your Fly Easy builds and
                delivers it fast, tailored around how your team works.
              </p>
            </div>

            {/* Clean Primary & Glass Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-7">
              <button
                type="button"
                onClick={() => navigateToSection('ready-softwares')}
                className="btn-standard-primary rounded-xl px-6 py-3 text-sm"
              >
                <Layers className="w-4 h-4" />
                Explore Ready ERPs
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('what-we-build')}
                className="btn-standard-glass rounded-xl px-6 py-3 text-sm"
              >
                <Sparkles className="w-4 h-4 text-violet-700" />
                What We Can Build
              </button>
              <a
                href={buildWhatsAppUrl(
                  'Assalam-o-Alaikum Make Your Fly Easy, I would like a live consultation & software demo.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-standard-glass rounded-xl px-6 py-3 text-sm"
              >
                <MessageCircle className="w-4 h-4 text-violet-700" />
                WhatsApp
              </a>
            </div>

            {/* Clean 4-Metric Proof Strip */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8">
              {[
                { label: 'Ready Flagship ERPs', val: '3 Suites' },
                { label: 'Custom Solutions', val: '12+ Categories' },
                { label: 'Delivery Speed', val: 'Fast Launch' },
                { label: 'Direct Desk', val: '24/7 Support' },
              ].map((stat) => (
                <div key={stat.label} className="glass-inner-tile rounded-2xl px-3.5 py-3.5">
                  <div className="font-display text-base sm:text-lg font-extrabold text-royal-purple tabular-nums">
                    {stat.val}
                  </div>
                  <div className="text-[11px] font-medium text-[#5B5480] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

            {/* SECTION 2: 100% READY-TO-DEPLOY BUSINESS SOFTWARES */}
            <section id="ready-softwares" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
              <div className="max-w-2xl mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                  Ready Business Solutions
                </p>
                <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
                  What Our Ready Softwares Do &amp; How They Help You
                </h2>
                <p className="body-fluid-copy text-[#47416A] mt-2">
                  Each software is built around real daily office work—clear to operate, fast for
                  staff, and focused on saving time while protecting every rupee of profit.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {READY_SUITES.map((suite) => (
                  <article
                    key={suite.id}
                    className="glass-surface rounded-3xl p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-violet-100/80 border border-violet-200 flex items-center justify-center">
                          {suite.icon}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
                          {suite.suiteLabel}
                        </span>
                      </div>

                      <h3 className="card-fluid-title text-[#141129]">{suite.title}</h3>

                      <div className="glass-inner-tile rounded-2xl p-3.5 space-y-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                          What It Does
                        </div>
                        <p className="text-xs leading-relaxed text-[#47416A]">
                          {suite.whatItDoes}
                        </p>
                      </div>

                      <div className="glass-inner-tile rounded-2xl p-3.5 space-y-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                          How It Works
                        </div>
                        <p className="text-xs leading-relaxed text-[#47416A]">
                          {suite.howItWorks}
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                          Key Benefits
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#2E2759]">
                          {suite.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-violet-200/60 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSpotlightSuite(suite)}
                        className="btn-standard-primary rounded-xl px-4 py-2.5 text-xs flex-1"
                      >
                        See How It Helps
                      </button>
                      <a
                        href={buildWhatsAppUrl(
                          `Hello Make Your Fly Easy, I want a live walkthrough of ${suite.title}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-standard-glass rounded-xl px-3.5 py-2.5 text-xs"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* SECTION 3: CUSTOM BUSINESS SOFTWARES WE BUILD */}
            <section id="what-we-build" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                    All-In-One Custom Solutions
                  </p>
                  <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
                    Everything Make Your Fly Easy Can Build For You
                  </h2>
                  <p className="body-fluid-copy text-[#47416A] mt-2">
                    From websites, online stores, and office dashboards to smart chatbots,
                    document readers, voice tools, and creative content—see what each solution
                    does, how it works, and how it helps your business grow.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToSection('contact')}
                  className="btn-standard-glass rounded-xl px-4 py-2.5 text-xs"
                >
                  Discuss Your Requirement
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {BUILD_CAPABILITIES.map((cap) => (
                  <article
                    key={cap.num}
                    className="glass-surface rounded-3xl p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-violet-700">
                          {cap.num}.
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-violet-100/80 border border-violet-200 flex items-center justify-center">
                          {cap.icon}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-violet-700/80">
                          {cap.category}
                        </p>
                        <h3 className="text-base font-bold text-[#141129] mt-1 leading-snug">
                          {cap.title}
                        </h3>
                      </div>

                      <div className="space-y-2 text-xs leading-relaxed text-[#47416A]">
                        <p>
                          <strong className="text-[#1E1B4B]">What it does: </strong>
                          {cap.whatItDoes}
                        </p>
                        <p>
                          <strong className="text-[#1E1B4B]">How it works: </strong>
                          {cap.howItWorks}
                        </p>
                      </div>

                      <div className="pt-1 space-y-1.5">
                        <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-violet-700">
                          Benefits
                        </div>
                        <ul className="space-y-1.5 text-[11.5px] font-medium text-[#2E2759]">
                          {cap.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-violet-700 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRequestCustomBuild(cap.title)}
                      className="btn-standard-soft rounded-xl px-3.5 py-2.5 text-xs w-full mt-5"
                    >
                      Inquire About This
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* SECTION 4: WHY BUSINESSES CHOOSE US & HOW WE DELIVER */}
            <section id="about-skills" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 glass-surface rounded-3xl p-6 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                    Why Businesses Choose Us
                  </p>
                  <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
                    Built Around Real Office Workflows, Not Complicated Menus
                  </h2>
                  <p className="body-fluid-copy text-[#47416A] mt-3">
                    Our goal is simple: give business owners and staff clean software that anyone
                    can learn quickly—saving hours of paperwork, preventing billing leakage, and
                    keeping complete accounts visible anytime.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: <Cpu className="w-4 h-4 text-violet-700" />,
                        label: 'Saves Staff Hours',
                      },
                      {
                        icon: <Shield className="w-4 h-4 text-violet-700" />,
                        label: 'Zero Billing Errors',
                      },
                      {
                        icon: <FileCheck2 className="w-4 h-4 text-violet-700" />,
                        label: 'Clear Profit Control',
                      },
                      {
                        icon: <Globe className="w-4 h-4 text-violet-700" />,
                        label: 'Easy Staff Usage',
                      },
                    ].map((pillar) => (
                      <div
                        key={pillar.label}
                        className="glass-inner-tile rounded-xl px-3 py-2.5 flex items-center gap-2 text-xs font-bold text-[#1E1B4B]"
                      >
                        {pillar.icon}
                        <span>{pillar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      step: '01',
                      title: 'Understand Your Daily Work',
                      desc: 'We review how your team currently handles orders, shipments, cases, or accounts and show you the software live.',
                    },
                    {
                      step: '02',
                      title: 'Customize For Your Office',
                      desc: 'Your company name, bills, reports, and staff access levels are adjusted to match your exact way of working.',
                    },
                    {
                      step: '03',
                      title: 'Simple Team Training',
                      desc: 'Your staff gets clear, step-by-step guidance so everyone uses the software comfortably from day one.',
                    },
                    {
                      step: '04',
                      title: 'Dedicated 24/7 Support',
                      desc: 'Direct Karachi HQ phone and WhatsApp assistance ensures your office work never slows down.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="glass-surface rounded-3xl p-5 sm:p-6">
                      <span className="font-mono text-xs font-extrabold text-violet-700">
                        Step {item.step}
                      </span>
                      <h3 className="text-base font-bold text-[#141129] mt-1.5">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-[#47416A] mt-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: EXECUTIVE CONTACT & VALIDATED INQUIRY FORM */}
            <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-16 sm:pb-20">
              <div className="glass-surface rounded-3xl p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Direct Details */}
                  <div className="lg:col-span-5 space-y-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                        Karachi Head Office
                      </p>
                      <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
                        Start Your Software Deployment Today
                      </h2>
                      <p className="body-fluid-copy text-[#47416A] mt-2">
                        Visit our Tower Karachi engineering office or connect directly on Mobile,
                        WhatsApp, or Landline for an immediate live demonstration.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="glass-inner-tile rounded-2xl p-4 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-violet-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-[#141129]">Head Office Address</div>
                          <p className="text-xs text-[#47416A] mt-0.5 leading-relaxed">
                            {OFFICE_ADDRESS}
                          </p>
                        </div>
                      </div>

                      <div className="glass-inner-tile rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-violet-700 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-[#141129]">Direct Mobile</div>
                            <a
                              href={`tel:${DIRECT_MOBILE_TEL}`}
                              className="text-sm font-extrabold text-royal-purple tabular-nums"
                            >
                              {DIRECT_MOBILE_DISPLAY}
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(DIRECT_MOBILE_DISPLAY, 'direct-mobile', 'Direct Mobile')
                          }
                          className="btn-standard-soft rounded-xl px-3 py-2 text-xs"
                        >
                          {copiedKey === 'direct-mobile' ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedKey === 'direct-mobile' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="glass-inner-tile rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-5 h-5 text-violet-700 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-[#141129]">WhatsApp Desk</div>
                            <a
                              href={buildWhatsAppUrl(
                                'Assalam-o-Alaikum Make Your Fly Easy, I would like to book a live ERP demonstration.'
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-extrabold text-royal-purple tabular-nums"
                            >
                              {WHATSAPP_DISPLAY}
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(WHATSAPP_DISPLAY, 'whatsapp', 'WhatsApp number')
                          }
                          className="btn-standard-soft rounded-xl px-3 py-2 text-xs"
                        >
                          {copiedKey === 'whatsapp' ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedKey === 'whatsapp' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="glass-inner-tile rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-violet-700 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-[#141129]">Office Landline</div>
                            <a
                              href={`tel:${LANDLINE_TEL}`}
                              className="text-sm font-extrabold text-royal-purple tabular-nums"
                            >
                              {LANDLINE_DISPLAY}
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(LANDLINE_DISPLAY, 'landline', 'Landline number')
                          }
                          className="btn-standard-soft rounded-xl px-3 py-2 text-xs"
                        >
                          {copiedKey === 'landline' ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedKey === 'landline' ? 'Copied' : 'Copy'}
                        </button>
                      </div>

                      <div className="glass-inner-tile rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Mail className="w-5 h-5 text-violet-700 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#141129]">
                              Official Email &amp; Web
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={`mailto:${EMAIL_ADDRESS}`}
                                className="text-xs sm:text-sm font-bold text-violet-800 truncate"
                              >
                                {EMAIL_ADDRESS}
                              </a>
                              <span className="text-violet-300">·</span>
                              <a
                                href={WEBSITE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs sm:text-sm font-bold text-violet-800 hover:underline"
                              >
                                {WEBSITE_DISPLAY}
                              </a>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(EMAIL_ADDRESS, 'email', 'Email address')}
                          className="btn-standard-soft rounded-xl px-3 py-2 text-xs shrink-0"
                        >
                          {copiedKey === 'email' ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedKey === 'email' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Interactive Validated Form */}
                  <form
                    onSubmit={handleContactSubmit}
                    className="lg:col-span-7 glass-inner-tile rounded-3xl p-5 sm:p-7 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          maxLength={INQUIRY_LIMITS.NAME_MAX}
                          placeholder="e.g. Muhammad Ali Khan"
                          className="w-full rounded-xl bg-white/90 border border-violet-200 px-3.5 py-2.5 text-sm text-[#141129] focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                          WhatsApp / Mobile Number *
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          maxLength={INQUIRY_LIMITS.PHONE_MAX}
                          placeholder="03XX-XXXXXXX"
                          className="w-full rounded-xl bg-white/90 border border-violet-200 px-3.5 py-2.5 text-sm text-[#141129] focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                        Software / Solution Interest
                      </label>
                      <input
                        type="text"
                        value={contactInterest}
                        onChange={(e) => setContactInterest(e.target.value)}
                        maxLength={INQUIRY_LIMITS.INTEREST_MAX}
                        className="w-full rounded-xl bg-white/90 border border-violet-200 px-3.5 py-2.5 text-sm text-[#141129] focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                        Project Brief / Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        maxLength={INQUIRY_LIMITS.MESSAGE_MAX}
                        placeholder="Share your business workflow, team size, or custom app requirements..."
                        className="w-full rounded-xl bg-white/90 border border-violet-200 px-3.5 py-2.5 text-sm text-[#141129] focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>

                    {contactFeedback && (
                      <div
                        className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 ${
                          contactFeedback.type === 'error'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-violet-50 text-violet-900 border border-violet-200'
                        }`}
                      >
                        {contactFeedback.type === 'error' ? (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        )}
                        <span>{contactFeedback.text}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={isSubmittingInquiry}
                        className="btn-standard-primary rounded-xl px-6 py-3 text-sm disabled:opacity-60"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {isSubmittingInquiry ? 'Saving & Opening WhatsApp...' : 'Send & Connect on WhatsApp'}
                      </button>
                      <a
                        href={`mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
                          `Project Inquiry: ${contactInterest}`
                        )}`}
                        className="btn-standard-glass rounded-xl px-5 py-3 text-sm"
                      >
                        <Mail className="w-4 h-4 text-violet-700" />
                        Send Email
                      </a>
                    </div>

                    <p className="text-[11px] leading-relaxed text-[#5B5480] pt-1">
                      By submitting this inquiry, you agree to our{' '}
                      <button
                        type="button"
                        onClick={() => setLegalTab('privacy')}
                        className="font-bold text-violet-700 hover:underline cursor-pointer"
                      >
                        Privacy Policy
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => setLegalTab('terms')}
                        className="font-bold text-violet-700 hover:underline cursor-pointer"
                      >
                        Terms &amp; Conditions
                      </button>
                      . Protected by strict write-only{' '}
                      <button
                        type="button"
                        onClick={() => setLegalTab('security')}
                        className="font-bold text-violet-700 hover:underline cursor-pointer"
                      >
                        Firebase Security Rules
                      </button>
                      .
                    </p>
                  </form>
                </div>
              </div>
            </section>

            {/* SECTION 6: PRIVACY POLICY, TERMS & CONDITIONS & FIREBASE SECURITY RULES */}
            <section id="legal-policies" className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-20">
              <div className="max-w-2xl mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                  Transparency, Legal Protection &amp; Cloud Security
                </p>
                <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
                  Privacy Policy, Terms &amp; Firebase Security Rules
                </h2>
                <p className="body-fluid-copy text-[#47416A] mt-2">
                  Clear terms protecting both our clients and Make Your Fly Easy—including built-in
                  client backup tools, responsibility boundaries, and strict cloud database rules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <article className="glass-surface rounded-3xl p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100/80 border border-violet-200 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-violet-700" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#141129]">Privacy Policy</h3>
                    <p className="text-xs leading-relaxed text-[#47416A]">
                      Explains what details we collect, zero data selling, client data ownership,
                      built-in software backup responsibility, and safeguards against hacking,
                      staff leaks, theft, or government-directed restrictions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLegalTab('privacy')}
                    className="btn-standard-soft rounded-xl px-4 py-2.5 text-xs w-full mt-5"
                  >
                    Read Privacy Policy
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </article>

                <article className="glass-surface rounded-3xl p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100/80 border border-violet-200 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-violet-700" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#141129]">
                      Terms &amp; Conditions
                    </h3>
                    <p className="text-xs leading-relaxed text-[#47416A]">
                      Covers service scope, mandatory client backups using the in-software backup
                      tool (zero MYFE data-loss liability), and no liability for government bans,
                      hacking, cyber attacks, hardware theft, or employee misuse.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLegalTab('terms')}
                    className="btn-standard-soft rounded-xl px-4 py-2.5 text-xs w-full mt-5"
                  >
                    Read Terms &amp; Conditions
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </article>

                <article className="glass-surface rounded-3xl p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100/80 border border-violet-200 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-violet-700" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#141129]">
                      Firebase Security Rules
                    </h3>
                    <p className="text-xs leading-relaxed text-[#47416A]">
                      Zero-Trust Firestore rules featuring global default-deny, strict write-only
                      PII isolation on inquiries, server timestamp validation, field allowlists, and
                      tamper-proof read-only catalog enforcement.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLegalTab('security')}
                    className="btn-standard-soft rounded-xl px-4 py-2.5 text-xs w-full mt-5"
                  >
                    Inspect Security Rules
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </article>
              </div>
            </section>
      </main>

      {/* QUIET LUXURY FOOTER */}
      <footer className="relative z-10 border-t border-violet-200/60 bg-white/65 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <RoyalLogo idSuffix="footer" className="h-10 sm:h-11 w-auto shrink-0" />
            <div className="min-h-10 sm:min-h-11 flex flex-col justify-between py-[1px]">
              <div className="font-display font-extrabold text-base sm:text-lg leading-none text-royal-purple">
                MAKE YOUR FLY EASY
              </div>
              <p className="text-xs text-[#5B5480] leading-snug mt-1">{OFFICE_ADDRESS}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#47416A]">
            <button
              type="button"
              onClick={() => navigateToSection('ready-softwares')}
              className="hover:text-violet-700 cursor-pointer"
            >
              Ready ERPs
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('what-we-build')}
              className="hover:text-violet-700 cursor-pointer"
            >
              Capabilities
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('about-skills')}
              className="hover:text-violet-700 cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('contact')}
              className="hover:text-violet-700 cursor-pointer"
            >
              Contact
            </button>
            <a href={`tel:${DIRECT_MOBILE_TEL}`} className="hover:text-violet-700 tabular-nums">
              {DIRECT_MOBILE_DISPLAY}
            </a>
            <a
              href={buildWhatsAppUrl('Assalam-o-Alaikum Make Your Fly Easy!')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-700 tabular-nums"
            >
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-violet-700">
              {EMAIL_ADDRESS}
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-700"
            >
              {WEBSITE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={() => setLegalTab('privacy')}
              className="hover:text-violet-700 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalTab('terms')}
              className="hover:text-violet-700 cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => setLegalTab('security')}
              className="hover:text-violet-700 cursor-pointer"
            >
              Firebase Security Rules
            </button>
            <span className="text-[#7B749E]">
              © {new Date().getFullYear()} Make Your Fly Easy
            </span>
          </div>
        </div>
      </footer>

      {/* READY SUITE OVERVIEW MODAL (WHAT IT DOES · HOW IT WORKS · BENEFITS) */}
      {(spotlightSuite || spotlightProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/40 backdrop-blur-md">
          <div className="glass-surface glass-modal-card w-full max-w-2xl rounded-3xl bg-white/95 overflow-hidden max-h-[90vh] flex flex-col">
            {spotlightProduct && !spotlightSuite && (
              <ProductBannerArt
                product={spotlightProduct}
                failedImage={Boolean(failedImages[spotlightProduct.id])}
                onImageError={() =>
                  setFailedImages((prev) => ({ ...prev, [spotlightProduct.id]: true }))
                }
              />
            )}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
                    {spotlightSuite
                      ? spotlightSuite.suiteLabel
                      : `${spotlightProduct?.category} · Ready Solution`}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#141129] mt-1">
                    {spotlightSuite ? spotlightSuite.title : spotlightProduct?.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSpotlightSuite(null);
                    setSpotlightProduct(null);
                  }}
                  className="btn-standard-soft rounded-xl p-2 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {spotlightSuite ? (
                <div className="space-y-3">
                  <div className="glass-inner-tile rounded-2xl p-4 space-y-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                      What This Software Does
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#47416A]">
                      {spotlightSuite.whatItDoes}
                    </p>
                  </div>

                  <div className="glass-inner-tile rounded-2xl p-4 space-y-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                      How It Works For Your Team
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#47416A]">
                      {spotlightSuite.howItWorks}
                    </p>
                  </div>

                  <div className="glass-inner-tile rounded-2xl p-4 space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                      Key Business Benefits
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#2E2759]">
                      {spotlightSuite.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#47416A]">
                    {spotlightProduct?.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2E2759]">
                    {(spotlightProduct?.features ?? []).map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href={buildWhatsAppUrl(
                    `Assalam-o-Alaikum Make Your Fly Easy, I want a live demo of ${
                      spotlightSuite ? spotlightSuite.title : spotlightProduct?.title
                    }.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-standard-primary rounded-xl px-5 py-2.5 text-xs flex-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  Request Live Demo on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() =>
                    handleRequestCustomBuild(
                      spotlightSuite ? spotlightSuite.title : spotlightProduct?.title || 'Ready ERP'
                    )
                  }
                  className="btn-standard-glass rounded-xl px-4 py-2.5 text-xs"
                >
                  Book via Contact Desk
                  <ArrowRight className="w-3.5 h-3.5 text-violet-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY, TERMS & CONDITIONS & FIREBASE SECURITY RULES MODAL */}
      <LegalSecurityModal
        activeTab={legalTab}
        onSelectTab={(tab) => setLegalTab(tab)}
        onClose={() => setLegalTab(null)}
      />

      {/* FLOATING BOTTOM-RIGHT WHATSAPP BUTTON (ICON ONLY — NO NUMBER) */}
      <a
        href={buildWhatsAppUrl(
          'Assalam-o-Alaikum Make Your Fly Easy, I would like to connect regarding your enterprise software solutions.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 btn-standard-primary w-14 h-14 rounded-2xl shadow-[0_14px_34px_-6px_rgba(109,40,217,0.55)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 text-white"
          aria-hidden="true"
        >
          <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969s-4.453-10-9.969-10zm5.828 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.031-1.313-5-4.375-5.156-4.578-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406.016.578.016.188 0 .438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.156.344-.313.531-.156.188-.328.406-.469.547-.156.156-.328.328-.141.641.188.313.844 1.391 1.813 2.25 1.25 1.109 2.297 1.453 2.609 1.609.313.156.484.125.672-.094.188-.219.797-.938 1.016-1.25.219-.313.422-.266.719-.156.297.109 1.875.891 2.203 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
        </svg>
      </a>
    </div>
  );
}

export default App;
