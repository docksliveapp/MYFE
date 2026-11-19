import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Box,
  Calculator,
  Check,
  Copy,
  FileText,
  Layers,
  MessageCircle,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
} from 'lucide-react';

export type ToolTab = 'estimator' | 'invoice' | 'cbm' | 'margin';

type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR';

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  PKR: 'PKR ',
  USD: '$',
  AED: 'AED ',
  GBP: '£',
  EUR: '€',
};

function formatMoney(amount: number, currency: CurrencyCode): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${CURRENCY_SYMBOLS[currency]}${safe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

interface CargoRow {
  id: string;
  label: string;
  length: number;
  width: number;
  height: number;
  qty: number;
  weightKg: number;
}

interface BusinessToolsSectionProps {
  initialTool?: ToolTab;
  onSendScopeToContact: (interest: string, brief: string) => void;
  onShareWhatsApp: (message: string) => void;
  onNotify: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const SOLUTION_TYPES = [
  { id: 'website', label: 'Corporate Website & Portal', baseWeeks: 2, tier: 'Standard Business' },
  { id: 'ready-erp', label: 'Ready ERP Deployment', baseWeeks: 2, tier: 'Rapid Deployment' },
  { id: 'custom-erp', label: 'Custom Business ERP / CRM', baseWeeks: 5, tier: 'Enterprise Suite' },
  {
    id: 'marketplace',
    label: 'Multi-Vendor Marketplace',
    baseWeeks: 6,
    tier: 'Multi-Portal Commerce',
  },
  { id: 'mobile-app', label: 'Android & iOS Mobile App', baseWeeks: 5, tier: 'Cross-Platform App' },
  {
    id: 'automation',
    label: 'Smart Office Automation',
    baseWeeks: 4,
    tier: 'Workflow Intelligence',
  },
] as const;

const TEAM_SCALES = [
  { id: 'small', label: 'Single Office (1–10 Staff)', extraWeeks: 0 },
  { id: 'medium', label: 'Multi-Department (11–40 Staff)', extraWeeks: 1.5 },
  { id: 'enterprise', label: 'Multi-Branch Enterprise (40+ Staff)', extraWeeks: 3 },
] as const;

const PLATFORM_OPTIONS = [
  { id: 'web', label: 'Web Portal', extraWeeks: 0 },
  { id: 'desktop', label: 'Windows / Desktop App', extraWeeks: 1.5 },
  { id: 'mobile', label: 'Android & iOS Apps', extraWeeks: 2.5 },
] as const;

const ADDON_MODULES = [
  { id: 'billing', label: 'Automated Billing & Party Ledgers', extraWeeks: 1 },
  { id: 'roles', label: 'Role-Based Staff Permissions & Audit Trail', extraWeeks: 0.5 },
  { id: 'alerts', label: 'WhatsApp Alerts & PDF Reporting', extraWeeks: 0.5 },
  { id: 'backup', label: 'Scheduled Cloud Sync & Local Backup Tool', extraWeeks: 0.5 },
  { id: 'multilang', label: 'Multi-Currency & Multi-Language Interface', extraWeeks: 1 },
] as const;

export const BusinessToolsSection: React.FC<BusinessToolsSectionProps> = ({
  initialTool = 'estimator',
  onSendScopeToContact,
  onShareWhatsApp,
  onNotify,
}) => {
  const [activeTool, setActiveTool] = useState<ToolTab>(initialTool);
  React.useEffect(() => {
    setActiveTool(initialTool);
  }, [initialTool]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySummary = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      onNotify(`${label} copied to clipboard.`);
      window.setTimeout(() => setCopiedId(null), 2200);
    } catch {
      onNotify('Clipboard access is unavailable in this browser.', 'info');
    }
  };

  // =========================================================================
  // TOOL 1: SOFTWARE PROJECT SCOPE & TIMELINE ESTIMATOR
  // =========================================================================
  const [solutionId, setSolutionId] = useState<(typeof SOLUTION_TYPES)[number]['id']>('custom-erp');
  const [scaleId, setScaleId] = useState<(typeof TEAM_SCALES)[number]['id']>('medium');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['web']);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['billing', 'roles']);

  const toggleSelection = (list: string[], value: string, minOne = false): string[] => {
    if (list.includes(value)) {
      if (minOne && list.length <= 1) return list;
      return list.filter((item) => item !== value);
    }
    return [...list, value];
  };

  const scopeEstimate = useMemo(() => {
    const solution = SOLUTION_TYPES.find((s) => s.id === solutionId) ?? SOLUTION_TYPES[0];
    const scale = TEAM_SCALES.find((s) => s.id === scaleId) ?? TEAM_SCALES[0];
    const platformWeeks = PLATFORM_OPTIONS.filter((p) => selectedPlatforms.includes(p.id)).reduce(
      (sum, p) => sum + p.extraWeeks,
      0
    );
    const addonWeeks = ADDON_MODULES.filter((a) => selectedAddons.includes(a.id)).reduce(
      (sum, a) => sum + a.extraWeeks,
      0
    );
    const minWeeks = Math.max(2, Math.round(solution.baseWeeks + scale.extraWeeks + platformWeeks + addonWeeks));
    const maxWeeks = minWeeks + 2;

    const platformLabels = PLATFORM_OPTIONS.filter((p) => selectedPlatforms.includes(p.id)).map(
      (p) => p.label
    );
    const addonLabels = ADDON_MODULES.filter((a) => selectedAddons.includes(a.id)).map(
      (a) => a.label
    );

    const brief = [
      `Solution: ${solution.label}`,
      `Organization Scale: ${scale.label}`,
      `Target Platforms: ${platformLabels.join(', ')}`,
      `Included Modules: ${addonLabels.length > 0 ? addonLabels.join(', ') : 'Core Standard Modules'}`,
      `Estimated Delivery Window: ${minWeeks}–${maxWeeks} Weeks`,
    ].join('\n');

    return {
      solution,
      scale,
      minWeeks,
      maxWeeks,
      platformLabels,
      addonLabels,
      brief,
    };
  }, [solutionId, scaleId, selectedPlatforms, selectedAddons]);

  // =========================================================================
  // TOOL 2: INSTANT INVOICE & QUOTATION BUILDER
  // =========================================================================
  const [docType, setDocType] = useState<'Quotation' | 'Invoice'>('Quotation');
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [senderName, setSenderName] = useState('Your Company Name');
  const [clientName, setClientName] = useState('Valued Client Organization');
  const [docNumber, setDocNumber] = useState(
    `QT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}01`
  );
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceLineItem[]>([
    { id: 'row-1', description: 'Enterprise Software License & Setup', qty: 1, rate: 150000 },
    { id: 'row-2', description: 'Staff Training & Initial Data Migration', qty: 1, rate: 35000 },
  ]);

  const invoiceTotals = useMemo(() => {
    const subtotal = invoiceItems.reduce(
      (sum, row) => sum + Math.max(0, row.qty) * Math.max(0, row.rate),
      0
    );
    const discountAmt = subtotal * (Math.min(100, Math.max(0, discountRate)) / 100);
    const taxableBase = Math.max(0, subtotal - discountAmt);
    const taxAmt = taxableBase * (Math.min(100, Math.max(0, taxRate)) / 100);
    const grandTotal = taxableBase + taxAmt;
    return { subtotal, discountAmt, taxAmt, grandTotal };
  }, [invoiceItems, discountRate, taxRate]);

  const addInvoiceRow = () => {
    setInvoiceItems((prev) => [
      ...prev,
      { id: `row-${Date.now()}`, description: 'Additional Service Item', qty: 1, rate: 0 },
    ]);
  };

  const updateInvoiceRow = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setInvoiceItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeInvoiceRow = (id: string) => {
    setInvoiceItems((prev) => (prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)));
  };

  const invoicePlainSummary = useMemo(() => {
    const lines = invoiceItems.map(
      (item, idx) =>
        `${idx + 1}. ${item.description || 'Item'} — Qty ${item.qty} × ${formatMoney(
          item.rate,
          currency
        )} = ${formatMoney(item.qty * item.rate, currency)}`
    );
    return [
      `${docType.toUpperCase()} #${docNumber}`,
      `From: ${senderName}`,
      `To: ${clientName}`,
      `Date: ${issueDate}`,
      '--------------------------------',
      ...lines,
      '--------------------------------',
      `Subtotal: ${formatMoney(invoiceTotals.subtotal, currency)}`,
      discountRate > 0
        ? `Discount (${discountRate}%): -${formatMoney(invoiceTotals.discountAmt, currency)}`
        : null,
      taxRate > 0 ? `Tax / GST (${taxRate}%): ${formatMoney(invoiceTotals.taxAmt, currency)}` : null,
      `GRAND TOTAL: ${formatMoney(invoiceTotals.grandTotal, currency)}`,
    ]
      .filter(Boolean)
      .join('\n');
  }, [
    docType,
    docNumber,
    senderName,
    clientName,
    issueDate,
    invoiceItems,
    currency,
    invoiceTotals,
    discountRate,
    taxRate,
  ]);

  // =========================================================================
  // TOOL 3: CBM CARGO VOLUME & CONTAINER PLANNER
  // =========================================================================
  const [dimUnit, setDimUnit] = useState<'cm' | 'in' | 'm'>('cm');
  const [cargoRows, setCargoRows] = useState<CargoRow[]>([
    { id: 'c-1', label: 'Standard Export Cartons', length: 60, width: 40, height: 45, qty: 120, weightKg: 18 },
    { id: 'c-2', label: 'Palletized Machinery Cases', length: 120, width: 100, height: 90, qty: 8, weightKg: 240 },
  ]);

  const cargoSummary = useMemo(() => {
    const unitToMeters = dimUnit === 'cm' ? 0.01 : dimUnit === 'in' ? 0.0254 : 1;
    let totalCbm = 0;
    let totalGrossKg = 0;
    let totalPackages = 0;

    cargoRows.forEach((row) => {
      const l = Math.max(0, row.length) * unitToMeters;
      const w = Math.max(0, row.width) * unitToMeters;
      const h = Math.max(0, row.height) * unitToMeters;
      const qty = Math.max(0, row.qty);
      const wt = Math.max(0, row.weightKg);
      totalCbm += l * w * h * qty;
      totalGrossKg += wt * qty;
      totalPackages += qty;
    });

    const totalCft = totalCbm * 35.3147;
    const airVolumetricKg = totalCbm * 167;
    const chargeableAirKg = Math.max(totalGrossKg, airVolumetricKg);

    const util20ft = (totalCbm / 28) * 100;
    const util40ft = (totalCbm / 58) * 100;
    const util40hc = (totalCbm / 68) * 100;

    let recommendation = 'LCL Shared Consolidation Cargo';
    if (totalCbm > 68) {
      const hcCount = Math.ceil(totalCbm / 68);
      recommendation = `${hcCount} × 40ft High Cube Containers`;
    } else if (totalCbm > 58) {
      recommendation = '1 × 40ft High Cube Container (68 CBM)';
    } else if (totalCbm > 28) {
      recommendation = '1 × 40ft Standard Container (58 CBM)';
    } else if (totalCbm >= 14) {
      recommendation = '1 × 20ft Standard Container (28 CBM)';
    }

    const summaryText = [
      'CBM Cargo Volume & Freight Summary',
      `Total Packages: ${totalPackages.toLocaleString('en-US')}`,
      `Total Volume: ${totalCbm.toFixed(3)} CBM (${totalCft.toFixed(1)} CFT)`,
      `Total Gross Weight: ${totalGrossKg.toFixed(1)} kg`,
      `Air Volumetric Weight: ${airVolumetricKg.toFixed(1)} kg (Chargeable: ${chargeableAirKg.toFixed(1)} kg)`,
      `Recommended Container: ${recommendation}`,
    ].join('\n');

    return {
      totalCbm,
      totalCft,
      totalGrossKg,
      totalPackages,
      airVolumetricKg,
      chargeableAirKg,
      util20ft,
      util40ft,
      util40hc,
      recommendation,
      summaryText,
    };
  }, [cargoRows, dimUnit]);

  const addCargoRow = () => {
    setCargoRows((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        label: `Package Lot ${prev.length + 1}`,
        length: 50,
        width: 40,
        height: 40,
        qty: 10,
        weightKg: 15,
      },
    ]);
  };

  const updateCargoRow = (id: string, field: keyof CargoRow, value: string | number) => {
    setCargoRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeCargoRow = (id: string) => {
    setCargoRows((prev) => (prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)));
  };

  // =========================================================================
  // TOOL 4: PROFIT MARGIN, MARKUP & GST / TAX CALCULATOR
  // =========================================================================
  const [marginCurrency, setMarginCurrency] = useState<CurrencyCode>('PKR');
  const [unitCost, setUnitCost] = useState<number>(4200);
  const [unitSellingPrice, setUnitSellingPrice] = useState<number>(5800);
  const [marginQty, setMarginQty] = useState<number>(25);
  const [marginTaxPct, setMarginTaxPct] = useState<number>(18);

  const marginStats = useMemo(() => {
    const cost = Math.max(0, unitCost);
    const sell = Math.max(0, unitSellingPrice);
    const qty = Math.max(1, marginQty);
    const tax = Math.min(100, Math.max(0, marginTaxPct));

    const profitPerUnit = sell - cost;
    const marginPct = sell > 0 ? (profitPerUnit / sell) * 100 : 0;
    const markupPct = cost > 0 ? (profitPerUnit / cost) * 100 : 0;
    const totalRevenueExTax = sell * qty;
    const totalCost = cost * qty;
    const totalProfit = profitPerUnit * qty;
    const taxAmountTotal = totalRevenueExTax * (tax / 100);
    const finalPriceInclTax = totalRevenueExTax + taxAmountTotal;

    const copyText = [
      'Business Margin & Tax Breakdown',
      `Unit Cost: ${formatMoney(cost, marginCurrency)} | Selling Price: ${formatMoney(sell, marginCurrency)} | Qty: ${qty}`,
      `Profit per Unit: ${formatMoney(profitPerUnit, marginCurrency)}`,
      `Profit Margin: ${marginPct.toFixed(2)}% | Markup: ${markupPct.toFixed(2)}%`,
      `Net Revenue (Excl. Tax): ${formatMoney(totalRevenueExTax, marginCurrency)}`,
      `GST / Tax (${tax}%): ${formatMoney(taxAmountTotal, marginCurrency)}`,
      `Total Invoice Value (Incl. Tax): ${formatMoney(finalPriceInclTax, marginCurrency)}`,
      `Total Net Profit: ${formatMoney(totalProfit, marginCurrency)}`,
    ].join('\n');

    return {
      profitPerUnit,
      marginPct,
      markupPct,
      totalRevenueExTax,
      totalCost,
      totalProfit,
      taxAmountTotal,
      finalPriceInclTax,
      copyText,
    };
  }, [unitCost, unitSellingPrice, marginQty, marginTaxPct, marginCurrency]);

  const toolTabs: { id: ToolTab; label: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'estimator',
      label: 'Scope Estimator',
      subtitle: 'Software timeline & brief',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'invoice',
      label: 'Invoice & Quote',
      subtitle: 'Instant PDF / print builder',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'cbm',
      label: 'CBM Cargo Planner',
      subtitle: 'Volume & container fit',
      icon: <Box className="w-4 h-4" />,
    },
    {
      id: 'margin',
      label: 'Margin & Tax',
      subtitle: 'Profit, markup & GST',
      icon: <Calculator className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
          Free Interactive Business Utilities
        </p>
        <h1 className="section-fluid-heading font-extrabold text-[#17122E] mt-1">
          Practical Everyday Business Tools
        </h1>
        <p className="body-fluid-copy text-[#47416A] mt-2">
          Built by Make Your Fly Easy for business owners, logistics teams, and finance offices—plan
          software delivery timelines, generate print-ready quotations, calculate shipping container
          volumes, and check profit margins instantaneously.
        </p>
      </div>

      {/* Tool Selector Strip */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print"
        role="tablist"
        aria-label="Business utility tools"
      >
        {toolTabs.map((tab) => {
          const isActive = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTool(tab.id)}
              className={`rounded-2xl px-4 py-3.5 text-left flex items-center gap-3 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-violet-700 via-purple-700 to-violet-800 text-white shadow-[0_10px_24px_-8px_rgba(109,40,217,0.45)] border border-violet-500/40'
                  : 'glass-surface text-[#17122E] hover:-translate-y-0.5'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-violet-100/85 border border-violet-200 text-violet-700'
                }`}
              >
                {tab.icon}
              </span>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-extrabold truncate">{tab.label}</div>
                <div
                  className={`text-[11px] truncate ${
                    isActive ? 'text-violet-100' : 'text-[#5B5480]'
                  }`}
                >
                  {tab.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          PANEL 1: SOFTWARE PROJECT SCOPE & TIMELINE ESTIMATOR
         ===================================================================== */}
      {activeTool === 'estimator' && (
        <div className="glass-surface rounded-3xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-violet-700 mb-2.5">
                1. Select Solution Category
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SOLUTION_TYPES.map((sol) => {
                  const selected = solutionId === sol.id;
                  return (
                    <button
                      key={sol.id}
                      type="button"
                      onClick={() => setSolutionId(sol.id)}
                      className={`rounded-xl px-4 py-3 text-left transition-all cursor-pointer border ${
                        selected
                          ? 'bg-violet-700 text-white border-violet-700 shadow-sm'
                          : 'glass-inner-tile text-[#17122E] hover:border-violet-400'
                      }`}
                    >
                      <div className="text-xs sm:text-[13px] font-bold">{sol.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          selected ? 'text-violet-100' : 'text-[#5B5480]'
                        }`}
                      >
                        {sol.tier}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-violet-700 mb-2.5">
                2. Organization &amp; User Scale
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TEAM_SCALES.map((sc) => {
                  const selected = scaleId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setScaleId(sc.id)}
                      className={`rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer border text-left ${
                        selected
                          ? 'bg-violet-700 text-white border-violet-700'
                          : 'glass-inner-tile text-[#17122E] hover:border-violet-400'
                      }`}
                    >
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-violet-700 mb-2.5">
                3. Target Platforms (Select One or More)
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PLATFORM_OPTIONS.map((plat) => {
                  const selected = selectedPlatforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlatforms((prev) => toggleSelection(prev, plat.id, true))
                      }
                      className={`rounded-xl px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer border ${
                        selected
                          ? 'bg-violet-100 border-violet-500 text-violet-900'
                          : 'glass-inner-tile text-[#3B3561] hover:border-violet-300'
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${selected ? 'text-violet-700' : 'opacity-25'}`}
                      />
                      {plat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-violet-700 mb-2.5">
                4. Optional Enterprise Modules
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADDON_MODULES.map((mod) => {
                  const selected = selectedAddons.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setSelectedAddons((prev) => toggleSelection(prev, mod.id))}
                      className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2 text-left transition-all cursor-pointer border ${
                        selected
                          ? 'bg-violet-100/90 border-violet-500 text-violet-950'
                          : 'glass-inner-tile text-[#47416A] hover:border-violet-300'
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          selected ? 'text-violet-700' : 'opacity-25'
                        }`}
                      />
                      <span>{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Scope Blueprint Output */}
          <div className="lg:col-span-5 glass-inner-tile rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                  Live Project Blueprint
                </span>
                <h2 className="text-xl font-extrabold text-[#17122E] mt-1">
                  {scopeEstimate.solution.label}
                </h2>
                <p className="text-xs text-[#5B5480] mt-0.5">{scopeEstimate.scale.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/90 border border-violet-200/80 p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B5480]">
                    Est. Delivery
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-royal-purple tabular-nums mt-0.5">
                    {scopeEstimate.minWeeks}–{scopeEstimate.maxWeeks} Wks
                  </div>
                </div>
                <div className="rounded-xl bg-white/90 border border-violet-200/80 p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B5480]">
                    Architecture
                  </div>
                  <div className="text-sm font-extrabold text-[#17122E] mt-1.5 leading-tight">
                    {scopeEstimate.solution.tier}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-extrabold uppercase tracking-wider text-violet-700 text-[11px]">
                  Structured Delivery Roadmap
                </div>
                <ul className="space-y-1.5 text-[#3B3561]">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Phase 1:</strong> Workflow mapping &amp; screen architecture
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Phase 2:</strong> Core build across{' '}
                      {scopeEstimate.platformLabels.join(', ')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Phase 3:</strong> Security testing, staff training &amp; 24/7 go-live
                      support
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-violet-200/70">
              <button
                type="button"
                onClick={() =>
                  onSendScopeToContact(
                    scopeEstimate.solution.label,
                    `Hello Make Your Fly Easy Team, please prepare a proposal based on this estimated scope:\n${scopeEstimate.brief}`
                  )
                }
                className="btn-standard-primary rounded-xl px-4 py-2.5 text-xs w-full"
              >
                Send Scope to Contact Desk
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onShareWhatsApp(
                      `Hello Make Your Fly Easy Team, I estimated this software scope on myfe.org:\n\n${scopeEstimate.brief}`
                    )
                  }
                  className="btn-standard-glass rounded-xl px-3 py-2 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-violet-700" />
                  WhatsApp Scope
                </button>
                <button
                  type="button"
                  onClick={() => copySummary(scopeEstimate.brief, 'scope', 'Project scope summary')}
                  className="btn-standard-soft rounded-xl px-3 py-2 text-xs"
                >
                  {copiedId === 'scope' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedId === 'scope' ? 'Copied' : 'Copy Scope'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PANEL 2: INSTANT INVOICE & QUOTATION GENERATOR
         ===================================================================== */}
      {activeTool === 'invoice' && (
        <div className="glass-surface rounded-3xl p-5 sm:p-8 space-y-6 printable-sheet">
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-2">
              {(['Quotation', 'Invoice'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDocType(mode)}
                  className={`rounded-xl px-4 py-2 text-xs ${
                    docType === mode ? 'btn-standard-primary' : 'btn-standard-glass'
                  }`}
                >
                  {mode}
                </button>
              ))}
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs font-bold text-[#17122E] focus:outline-none focus:border-violet-600"
              >
                {(['PKR', 'USD', 'AED', 'GBP', 'EUR'] as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    Currency: {code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copySummary(invoicePlainSummary, 'invoice', `${docType} summary`)}
                className="btn-standard-soft rounded-xl px-3.5 py-2 text-xs"
              >
                {copiedId === 'invoice' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedId === 'invoice' ? 'Copied' : 'Copy Text'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-standard-primary rounded-xl px-4 py-2 text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Document Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-violet-700 mb-1">
                From (Your Company)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs sm:text-sm font-semibold text-[#17122E] focus:outline-none focus:border-violet-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-violet-700 mb-1">
                Bill / Quote To
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs sm:text-sm font-semibold text-[#17122E] focus:outline-none focus:border-violet-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-violet-700 mb-1">
                {docType} Reference #
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs sm:text-sm font-semibold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-violet-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs sm:text-sm font-semibold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
              />
            </div>
          </div>

          {/* Compact Zero-Horizontal-Scroll Line Items Table */}
          <div className="rounded-2xl border border-violet-200/80 overflow-hidden bg-white/80">
            <table className="glass-table text-left">
              <thead>
                <tr className="border-b border-violet-200/70 bg-violet-100/55 text-[11px] font-extrabold uppercase tracking-wider text-violet-800">
                  <th className="px-3 py-2.5 w-[44%]">Description</th>
                  <th className="px-2 py-2.5 w-[14%]">Qty</th>
                  <th className="px-2 py-2.5 w-[20%]">Rate</th>
                  <th className="px-3 py-2.5 w-[16%] text-right">Total</th>
                  <th className="px-2 py-2.5 w-[6%] text-center no-print" aria-label="Remove" />
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-200/50 text-xs">
                {invoiceItems.map((row) => {
                  const lineTotal = Math.max(0, row.qty) * Math.max(0, row.rate);
                  return (
                    <tr key={row.id} className="glass-table-row">
                      <td className="px-2.5 py-2">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updateInvoiceRow(row.id, 'description', e.target.value)}
                          placeholder="Item or service description"
                          className="w-full rounded-lg bg-white/95 border border-violet-200/80 px-2.5 py-1.5 text-xs font-medium text-[#17122E] focus:outline-none focus:border-violet-600"
                        />
                      </td>
                      <td className="px-1.5 py-2">
                        <input
                          type="number"
                          min={0}
                          value={row.qty}
                          onChange={(e) =>
                            updateInvoiceRow(row.id, 'qty', Number(e.target.value) || 0)
                          }
                          className="w-full rounded-lg bg-white/95 border border-violet-200/80 px-2 py-1.5 text-xs font-semibold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                        />
                      </td>
                      <td className="px-1.5 py-2">
                        <input
                          type="number"
                          min={0}
                          value={row.rate}
                          onChange={(e) =>
                            updateInvoiceRow(row.id, 'rate', Number(e.target.value) || 0)
                          }
                          className="w-full rounded-lg bg-white/95 border border-violet-200/80 px-2 py-1.5 text-xs font-semibold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-extrabold text-[#17122E] tabular-nums whitespace-nowrap">
                        {formatMoney(lineTotal, currency)}
                      </td>
                      <td className="px-1.5 py-2 text-center no-print">
                        <button
                          type="button"
                          onClick={() => removeInvoiceRow(row.id)}
                          disabled={invoiceItems.length <= 1}
                          aria-label="Remove item row"
                          className="p-1.5 rounded-lg text-[#6B648F] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="space-y-3 no-print">
              <button
                type="button"
                onClick={addInvoiceRow}
                className="btn-standard-soft rounded-xl px-4 py-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Line Item
              </button>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#47416A] mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                    className="w-full rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs font-bold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#47416A] mb-1">
                    Tax / GST (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                    className="w-full rounded-xl bg-white/92 border border-violet-200 px-3 py-2 text-xs font-bold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                  />
                </div>
              </div>
            </div>

            <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 w-full md:w-80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#47416A]">
                <span>Subtotal</span>
                <span className="font-bold tabular-nums">
                  {formatMoney(invoiceTotals.subtotal, currency)}
                </span>
              </div>
              {discountRate > 0 && (
                <div className="flex items-center justify-between text-[#47416A]">
                  <span>Discount ({discountRate}%)</span>
                  <span className="font-bold tabular-nums text-emerald-700">
                    -{formatMoney(invoiceTotals.discountAmt, currency)}
                  </span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex items-center justify-between text-[#47416A]">
                  <span>Tax / GST ({taxRate}%)</span>
                  <span className="font-bold tabular-nums">
                    {formatMoney(invoiceTotals.taxAmt, currency)}
                  </span>
                </div>
              )}
              <div className="pt-2.5 border-t border-violet-200/80 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-violet-800">
                  Grand Total
                </span>
                <span className="font-display text-lg font-extrabold text-royal-purple tabular-nums">
                  {formatMoney(invoiceTotals.grandTotal, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PANEL 3: CBM CARGO VOLUME & CONTAINER PLANNER
         ===================================================================== */}
      {activeTool === 'cbm' && (
        <div className="glass-surface rounded-3xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#47416A]">Dimension Unit:</span>
              {(['cm', 'in', 'm'] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setDimUnit(unit)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs uppercase ${
                    dimUnit === unit ? 'btn-standard-primary' : 'btn-standard-glass'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={addCargoRow}
                className="btn-standard-soft rounded-xl px-3.5 py-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Package Lot
              </button>
              <button
                type="button"
                onClick={() =>
                  copySummary(cargoSummary.summaryText, 'cbm', 'Cargo CBM summary')
                }
                className="btn-standard-primary rounded-xl px-4 py-2 text-xs"
              >
                {copiedId === 'cbm' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedId === 'cbm' ? 'Copied' : 'Copy Cargo Summary'}
              </button>
            </div>
          </div>

          {/* Compact Cargo Lot Table */}
          <div className="rounded-2xl border border-violet-200/80 overflow-hidden bg-white/80">
            <table className="glass-table text-left">
              <thead>
                <tr className="border-b border-violet-200/70 bg-violet-100/55 text-[10.5px] font-extrabold uppercase tracking-wider text-violet-800">
                  <th className="px-2.5 py-2.5 w-[26%]">Lot Label</th>
                  <th className="px-1.5 py-2.5 w-[13%]">L ({dimUnit})</th>
                  <th className="px-1.5 py-2.5 w-[13%]">W ({dimUnit})</th>
                  <th className="px-1.5 py-2.5 w-[13%]">H ({dimUnit})</th>
                  <th className="px-1.5 py-2.5 w-[13%]">Qty</th>
                  <th className="px-1.5 py-2.5 w-[15%]">Wt/Pkg (kg)</th>
                  <th className="px-1.5 py-2.5 w-[7%] text-center" aria-label="Remove" />
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-200/50 text-xs">
                {cargoRows.map((row) => (
                  <tr key={row.id} className="glass-table-row">
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => updateCargoRow(row.id, 'label', e.target.value)}
                        className="w-full rounded-lg bg-white/95 border border-violet-200/80 px-2 py-1.5 text-xs font-medium text-[#17122E] focus:outline-none focus:border-violet-600"
                      />
                    </td>
                    {(['length', 'width', 'height', 'qty', 'weightKg'] as const).map((field) => (
                      <td key={field} className="px-1 py-2">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={row[field]}
                          onChange={(e) =>
                            updateCargoRow(row.id, field, Number(e.target.value) || 0)
                          }
                          className="w-full rounded-lg bg-white/95 border border-violet-200/80 px-2 py-1.5 text-xs font-semibold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                        />
                      </td>
                    ))}
                    <td className="px-1 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCargoRow(row.id)}
                        disabled={cargoRows.length <= 1}
                        aria-label="Remove package lot"
                        className="p-1.5 rounded-lg text-[#6B648F] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Metrics & Container Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Volume', val: `${cargoSummary.totalCbm.toFixed(2)} CBM` },
                { label: 'Cubic Feet', val: `${cargoSummary.totalCft.toFixed(0)} CFT` },
                {
                  label: 'Gross Weight',
                  val: `${cargoSummary.totalGrossKg.toLocaleString('en-US', {
                    maximumFractionDigits: 1,
                  })} kg`,
                },
                {
                  label: 'Air Chargeable',
                  val: `${cargoSummary.chargeableAirKg.toLocaleString('en-US', {
                    maximumFractionDigits: 1,
                  })} kg`,
                },
              ].map((m) => (
                <div key={m.label} className="glass-inner-tile rounded-2xl p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B5480]">
                    {m.label}
                  </div>
                  <div className="font-display text-base sm:text-lg font-extrabold text-royal-purple tabular-nums mt-1">
                    {m.val}
                  </div>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-4 glass-inner-tile rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                    Recommended Container Allocation
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#17122E] mt-0.5">
                    {cargoSummary.recommendation}
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#5B5480] tabular-nums">
                  {cargoSummary.totalPackages.toLocaleString('en-US')} total packages
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 glass-inner-tile rounded-2xl p-5 space-y-3.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                Container Space Utilization
              </div>
              {[
                { label: '20ft Standard (28 CBM)', pct: cargoSummary.util20ft },
                { label: '40ft Standard (58 CBM)', pct: cargoSummary.util40ft },
                { label: '40ft High Cube (68 CBM)', pct: cargoSummary.util40hc },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#17122E]">
                    <span>{bar.label}</span>
                    <span
                      className={`tabular-nums ${
                        bar.pct > 100 ? 'text-rose-600' : 'text-violet-700'
                      }`}
                    >
                      {bar.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-violet-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        bar.pct > 100
                          ? 'bg-rose-500'
                          : 'bg-gradient-to-r from-violet-600 to-purple-600'
                      }`}
                      style={{ width: `${Math.min(100, bar.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PANEL 4: PROFIT MARGIN, MARKUP & GST / TAX CALCULATOR
         ===================================================================== */}
      {activeTool === 'margin' && (
        <div className="glass-surface rounded-3xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                Enter Pricing &amp; Tax Figures
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Margin Currency"
                  value={marginCurrency}
                  onChange={(e) => setMarginCurrency(e.target.value as CurrencyCode)}
                  className="rounded-xl bg-white/92 border border-violet-200 px-3 py-1.5 text-xs font-bold text-[#17122E] focus:outline-none focus:border-violet-600"
                >
                  {(['PKR', 'USD', 'AED', 'GBP', 'EUR'] as CurrencyCode[]).map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setUnitCost(4200);
                    setUnitSellingPrice(5800);
                    setMarginQty(25);
                    setMarginTaxPct(18);
                  }}
                  aria-label="Reset calculator values"
                  className="btn-standard-soft rounded-xl px-2.5 py-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17122E] mb-1.5">
                  Cost Price per Unit ({marginCurrency})
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value) || 0)}
                  className="w-full rounded-xl bg-white/92 border border-violet-200 px-3.5 py-2.5 text-sm font-bold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17122E] mb-1.5">
                  Selling Price per Unit ({marginCurrency})
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={unitSellingPrice}
                  onChange={(e) => setUnitSellingPrice(Number(e.target.value) || 0)}
                  className="w-full rounded-xl bg-white/92 border border-violet-200 px-3.5 py-2.5 text-sm font-bold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17122E] mb-1.5">
                  Order Quantity (Units)
                </label>
                <input
                  type="number"
                  min={1}
                  value={marginQty}
                  onChange={(e) => setMarginQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-xl bg-white/92 border border-violet-200 px-3.5 py-2.5 text-sm font-bold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17122E] mb-1.5">
                  GST / Sales Tax (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={marginTaxPct}
                  onChange={(e) => setMarginTaxPct(Number(e.target.value) || 0)}
                  className="w-full rounded-xl bg-white/92 border border-violet-200 px-3.5 py-2.5 text-sm font-bold text-[#17122E] tabular-nums focus:outline-none focus:border-violet-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 glass-inner-tile rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/90 border border-violet-200/80 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B5480]">
                  Profit Margin
                </div>
                <div
                  className={`font-display text-xl sm:text-2xl font-extrabold tabular-nums mt-0.5 ${
                    marginStats.marginPct < 0 ? 'text-rose-600' : 'text-royal-purple'
                  }`}
                >
                  {marginStats.marginPct.toFixed(2)}%
                </div>
              </div>
              <div className="rounded-xl bg-white/90 border border-violet-200/80 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B5480]">
                  Markup Ratio
                </div>
                <div
                  className={`font-display text-xl sm:text-2xl font-extrabold tabular-nums mt-0.5 ${
                    marginStats.markupPct < 0 ? 'text-rose-600' : 'text-royal-purple'
                  }`}
                >
                  {marginStats.markupPct.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-[13px] pt-1">
              <div className="flex items-center justify-between text-[#47416A]">
                <span>Profit per Unit</span>
                <span className="font-extrabold text-[#17122E] tabular-nums">
                  {formatMoney(marginStats.profitPerUnit, marginCurrency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#47416A]">
                <span>Total Net Profit ({marginQty} units)</span>
                <span className="font-extrabold text-emerald-700 tabular-nums">
                  {formatMoney(marginStats.totalProfit, marginCurrency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#47416A]">
                <span>Revenue (Excl. Tax)</span>
                <span className="font-bold text-[#17122E] tabular-nums">
                  {formatMoney(marginStats.totalRevenueExTax, marginCurrency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#47416A]">
                <span>GST / Tax ({marginTaxPct}%)</span>
                <span className="font-bold text-[#17122E] tabular-nums">
                  {formatMoney(marginStats.taxAmountTotal, marginCurrency)}
                </span>
              </div>
              <div className="pt-2.5 border-t border-violet-200/80 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-violet-800">
                  Final Invoice Total
                </span>
                <span className="font-display text-lg font-extrabold text-royal-purple tabular-nums">
                  {formatMoney(marginStats.finalPriceInclTax, marginCurrency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                copySummary(marginStats.copyText, 'margin', 'Profit & tax calculation')
              }
              className="btn-standard-primary rounded-xl px-4 py-2.5 text-xs w-full"
            >
              {copiedId === 'margin' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedId === 'margin' ? 'Copied Breakdown' : 'Copy Calculation Breakdown'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
