import React from 'react';
import { CalendarCheck2, Check, ExternalLink, Globe, Scale } from 'lucide-react';

export interface AppHighlight {
  title: string;
  desc: string;
}

export interface FlagshipAppItem {
  id: string;
  suiteLabel: string;
  title: string;
  subtitle?: string;
  platforms?: string;
  releaseNote?: string;
  websiteUrl?: string;
  websiteLabel?: string;
  whatItDoes: string;
  howItWorks: string;
  benefits: string[];
  highlights?: AppHighlight[];
  icon: React.ReactNode;
}

export const OUR_APPS: FlagshipAppItem[] = [
  {
    id: 'app-eventzaar',
    suiteLabel: 'App 01 · Event Management & Multi-Vendor Marketplace',
    title: 'Eventzaar',
    subtitle: 'Your Complete Event Planning & Multi-Vendor Marketplace',
    platforms: 'Target Platforms: Web Portal · Android (Google Play) · iOS (App Store)',
    releaseNote:
      'Currently in active development — Google Play & App Store release links launching soon.',
    whatItDoes:
      'A complete Event Management and Multi-Vendor Booking platform built for weddings, corporate events, parties, and celebrations—connecting event organizers and customers directly with verified banquet halls, marquees, caterers, photographers, decorators, and entertainment providers.',
    howItWorks:
      'Browse verified vendor portfolios and client reviews, get instant quotations tailored to your event date and guest count, confirm bookings online with real-time alerts and digital invoicing, and manage function schedules (Mehndi, Barat, Walima, Conferences), checklists, and budgets while vendors handle packages and calendars on their own dedicated portals.',
    benefits: [
      'Multi-Vendor Marketplace: Compare banquet halls, marquees, caterers, photographers, and decor side by side',
      'Dedicated Vendor Portals & Multi-Portal Ecosystem: Customer App, Vendor Dashboard & Super Admin Panel with instant messaging & digital invoicing',
      'Instant Booking & Quotations with availability calendars, event budget tracker, and task checklists',
      'Function & Guest Scheduling (Mehndi, Barat, Walima, Conferences) with verified vendor portfolios and client reviews',
    ],
    highlights: [
      {
        title: 'Multi-Vendor Marketplace',
        desc: 'Browse and compare banquet halls, marquees, catering, photographers, decorators, and entertainment providers on a single platform.',
      },
      {
        title: 'Dedicated Vendor Portals',
        desc: 'Each service provider gets an independent dashboard to manage service packages, availability calendars, and incoming bookings.',
      },
      {
        title: 'Instant Booking & Quotations',
        desc: 'Receive instant pricing quotes based on event date and guest count and confirm event bookings online.',
      },
      {
        title: 'Event Budget & Checklist Tracker',
        desc: 'Monitor total event expenses, advances, and step-by-step planning checklists in real time.',
      },
      {
        title: 'Guest & Function Scheduling',
        desc: 'Coordinate timings and schedules across multiple event functions—Mehndi, Barat, Walima, or corporate conferences—in one timeline.',
      },
      {
        title: 'Verified Portfolios & Live Alerts',
        desc: 'Inspect genuine vendor photo portfolios and client reviews with digital invoicing, instant messaging, and real-time booking notifications.',
      },
    ],
    icon: <CalendarCheck2 className="w-5 h-5 text-violet-700" />,
  },
  {
    id: 'app-counsel-os',
    suiteLabel: 'App 02 · Legal Practice Management SaaS',
    title: 'Counsel OS',
    subtitle: 'The Complete AI-Powered Operating System for Lawyers & Law Firms',
    platforms:
      'Target Platforms: Web (counsel-os.net) · Android (Google Play) · iOS (App Store) · Windows (Microsoft Store)',
    releaseNote:
      'Currently in active development — Google Play, App Store & Microsoft Store release links launching soon.',
    websiteUrl: 'https://counsel-os.net',
    websiteLabel: 'counsel-os.net',
    whatItDoes:
      'A complete Legal Practice Management SaaS platform built for advocates, law firms, and legal chambers—bringing case files, court hearing diaries, AI legal drafting, Legal-size court PDF preparation, and chamber team access into one unified system supporting 195+ countries and 7-tier court hierarchies.',
    howItWorks:
      'Register each case with complete party details and attached documents, sync upcoming hearing dates with Google Calendar and background alarm notifications, prepare court applications and notices using the AI Legal Assistant, compile clean 8.5" × 14" Legal-size master PDFs, and assign specific cases with role-based permissions to junior associates and clerks.',
    benefits: [
      'Smart Case & Matter Management with Google Calendar sync and background hearing alarms so no court date is ever missed',
      'AI Legal Assistant for drafting court applications, legal notices, petitions, and finding legal precedents',
      'Advanced PDF Engine to split large files, clean scans, and compile Legal-size (8.5" x 14") court master PDFs',
      'Role-based Team Access (sub-IDs for junior associates & clerks), offline accessibility, and encrypted cloud sync across 195+ countries',
    ],
    highlights: [
      {
        title: 'Smart Case & Matter Management',
        desc: 'Complete case history, client and party records, and attached documents kept organized and secure in one workspace.',
      },
      {
        title: 'Court Diary & Hearing Reminders',
        desc: 'Automatic tracking of upcoming hearing dates with Google Calendar sync and background alarm notifications.',
      },
      {
        title: 'AI Legal Assistant & Drafting',
        desc: 'Prepare court applications, legal notices, and petitions faster while searching relevant legal precedents.',
      },
      {
        title: 'Advanced Document & PDF Engine',
        desc: 'Split large PDF files, clean scanned pages, and compile court-ready Legal-size (8.5" x 14") master PDFs.',
      },
      {
        title: 'Team & Role-Based Access',
        desc: 'Senior advocates can assign selected cases and controlled permissions to junior associates and chamber clerks (sub-IDs).',
      },
      {
        title: 'Global Court Hierarchy & Offline Sync',
        desc: 'Supports 195+ countries and 7-tier court systems with encrypted cloud sync, offline access, and push alerts.',
      },
    ],
    icon: <Scale className="w-5 h-5 text-violet-700" />,
  },
];

interface OurAppsSectionProps {
  id?: string;
  onInspectApp: (app: FlagshipAppItem) => void;
  onBookDemo: (appTitle: string) => void;
}

export const OurAppsSection: React.FC<OurAppsSectionProps> = ({
  id = 'our-apps',
  onInspectApp,
  onBookDemo,
}) => {
  return (
    <div id={id} className="space-y-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
          Our Apps
        </p>
        <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
          Dedicated Flagship Applications
        </h2>
        <p className="body-fluid-copy text-[#47416A] mt-2">
          Purpose-built cross-platform applications currently under active construction—official
          Google Play, App Store, and Microsoft Store links launching soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OUR_APPS.map((app) => (
          <article
            key={app.id}
            className="glass-surface rounded-3xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-100/80 border border-violet-200 flex items-center justify-center">
                  {app.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 text-right">
                  {app.suiteLabel}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#141129] tracking-tight">
                    {app.title}
                  </h3>
                  {app.websiteUrl && app.websiteLabel && (
                    <a
                      href={app.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {app.websiteLabel}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {app.subtitle && (
                  <p className="text-xs sm:text-[13px] font-semibold text-[#3B3561] mt-1">
                    {app.subtitle}
                  </p>
                )}
                {app.platforms && (
                  <p className="text-[11px] font-medium text-[#5B5480] mt-1.5">{app.platforms}</p>
                )}
                {app.releaseNote && (
                  <p className="text-[11px] font-bold text-violet-800 mt-1">{app.releaseNote}</p>
                )}
              </div>

              <div className="glass-inner-tile rounded-2xl p-3.5 space-y-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                  What It Does
                </div>
                <p className="text-xs leading-relaxed text-[#47416A]">{app.whatItDoes}</p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-3.5 space-y-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                  How It Works
                </div>
                <p className="text-xs leading-relaxed text-[#47416A]">{app.howItWorks}</p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">
                  Key Features &amp; Benefits
                </div>
                <ul className="space-y-1.5 text-xs text-[#2E2759]">
                  {app.benefits.map((benefit) => (
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
                onClick={() => onInspectApp(app)}
                className="btn-standard-primary rounded-xl px-4 py-2.5 text-xs flex-1"
              >
                Explore Full Features
              </button>
              <button
                type="button"
                onClick={() => onBookDemo(app.title)}
                className="btn-standard-glass rounded-xl px-4 py-2.5 text-xs"
              >
                Request Early Access
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
