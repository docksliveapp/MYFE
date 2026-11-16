import React from 'react';
import { AlertTriangle, Database, Lock, Scale, X } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms';

interface LegalSecurityModalProps {
  activeTab: LegalTab | null;
  onSelectTab: (tab: LegalTab) => void;
  onClose: () => void;
}

export const LegalSecurityModal: React.FC<LegalSecurityModalProps> = ({
  activeTab,
  onSelectTab,
  onClose,
}) => {
  if (!activeTab) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1E1B4B]/45 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Policy and Terms & Conditions"
    >
      <div className="glass-surface glass-modal-card w-full max-w-4xl rounded-3xl bg-white/95 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-violet-200/70 bg-gradient-to-r from-[#F4F0FF] via-white to-[#EFE8FF] flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-700">
              Make Your Fly Easy · Legal &amp; Protection Center
            </span>
            <h3 className="text-lg sm:text-2xl font-extrabold text-[#141129] mt-1">
              {activeTab === 'privacy'
                ? 'Privacy Policy & Data Protection'
                : 'Terms & Conditions of Service'}
            </h3>
            <p className="text-xs text-[#5B5480] mt-0.5">
              Effective Date: November 2026 · Applicable across myfe.org &amp; all MYFE Softwares
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Legal Window"
            className="btn-standard-soft rounded-xl p-2.5 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Tab Navigation */}
        <div className="px-5 sm:px-7 py-3 border-b border-violet-200/60 bg-white/80 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('privacy')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'btn-standard-primary'
                : 'btn-standard-glass text-[#2E2759]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('terms')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'btn-standard-primary'
                : 'btn-standard-glass text-[#2E2759]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Terms &amp; Conditions
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-[#362F5A]">
          {activeTab === 'privacy' && (
            <>
              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  1. Information We Collect &amp; Purpose
                </h4>
                <p>
                  Make Your Fly Easy (&ldquo;MYFE&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;)
                  collects only the contact details you voluntarily submit through our consultation
                  form, WhatsApp desk, phone, or email—such as your Full Name, WhatsApp/Mobile
                  Number, Software Interest, and Project Brief. We use this information strictly to
                  contact you, demonstrate our software solutions, build custom software per your
                  instructions, and provide ongoing technical support. We never sell, rent, or trade
                  your personal or business contact records to third-party marketers.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  2. Client Business Records Confidentiality
                </h4>
                <p>
                  All business files, customs GD data, bonded carrier/TIR/ATT manifests, advocate
                  case histories, accounting ledgers, invoices, and customer lists stored inside
                  software deployed for your organization remain strictly your property. Authorized
                  MYFE support staff only inspect files when explicitly invited by the client for
                  troubleshooting, training, or requested customization.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2 border-l-4 border-l-violet-600">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129] flex items-center gap-2">
                  <Database className="w-4 h-4 text-violet-700 shrink-0" />
                  3. Built-In Data Backup Option &amp; Zero Data-Loss Liability
                </h4>
                <p>
                  Make Your Fly Easy provides an easy-to-use <strong>Data Backup / Export</strong>{' '}
                  option inside our software suites so you can regularly save complete copies of
                  your records to your own computer, external drive, or private storage. Maintaining
                  regular, verified backups is strictly the client&apos;s ongoing duty.{' '}
                  <strong>
                    MYFE shall not be responsible or liable for any data loss, corruption, accidental
                    deletion, hardware crash, power failure, or missing records if regular backups
                    were not saved by the client.
                  </strong>
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2 border-l-4 border-l-violet-600">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-violet-700 shrink-0" />
                  4. Hacking, Theft, Staff Misuse &amp; Government Directives Disclaimer
                </h4>
                <p>
                  While MYFE protects our public inquiry inbox with encrypted transport and strict
                  write-only server access controls, no public internet connection or client-side
                  computer is 100% immune from external threats.{' '}
                  <strong>Make Your Fly Easy is NOT liable for:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li>
                    <strong>Hacking &amp; Cyber Attacks:</strong> Unauthorized access, malware,
                    ransomware, phishing, or third-party network intrusions arising from compromised
                    client devices, weak passwords, shared OTPs, or unpatched local computers.
                  </li>
                  <li>
                    <strong>Theft &amp; Internal Employee Leakage:</strong> Any physical theft of
                    laptops, mobile phones, USB drives, or servers, or unauthorized copying,
                    deletion, or leakage of client data by your own employees, partners, or
                    contractors.
                  </li>
                  <li>
                    <strong>Government Restrictions &amp; Regulatory Actions:</strong> Any temporary
                    or permanent suspension, blocking, inspection, or shutdown of internet
                    services, third-party platforms, portals, APIs, or hosted services ordered by
                    government authorities, regulators, PTA, or courts of law.
                  </li>
                </ul>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  5. Inquiry Storage, Deletion Requests &amp; Privacy Desk
                </h4>
                <p>
                  Website consultation submissions are stored securely and cannot be browsed or read
                  publicly. You may request review, correction, or removal of your submitted inquiry
                  details anytime by contacting our Karachi Head Office at{' '}
                  <strong>info@myfe.org</strong>, WhatsApp <strong>+92-339-8884124</strong>, Direct
                  Mobile <strong>+93-321-9222883</strong>, or Landline <strong>021-36601055</strong>.
                </p>
              </div>
            </>
          )}

          {activeTab === 'terms' && (
            <>
              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  1. Acceptance &amp; Scope of Services
                </h4>
                <p>
                  By browsing <strong>myfe.org</strong>, booking a demonstration, or purchasing,
                  installing, or using any software, website, mobile-friendly app, ERP, or custom
                  automation tool developed by <strong>Make Your Fly Easy</strong> (Office #13, 1st
                  Floor, State Life Building #7, G. Allana Road, Tower, Karachi, Pakistan), you
                  agree to be legally bound by these Terms &amp; Conditions.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2 border-l-4 border-l-violet-600">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  2. Government Bans, Regulatory Shutdowns &amp; Force Majeure
                </h4>
                <p>
                  <strong>
                    Make Your Fly Easy is NOT responsible or liable for any service interruption,
                    suspension, blocking, or discontinuation caused by government action or
                    regulatory authorities.
                  </strong>{' '}
                  If any website, cloud provider, telecom/internet network, payment gateway,
                  messaging platform (including WhatsApp), customs/tax/legal portal, or third-party
                  service is banned, restricted, taxed, throttled, or shut down by federal or
                  provincial government agencies, PTA, courts, or international sanctions, MYFE
                  shall bear zero financial or legal liability, and no refunds or damages shall be
                  claimed against MYFE for such external restrictions.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2 border-l-4 border-l-violet-600">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  3. Cyber Attacks, Hacking &amp; Security Responsibilities
                </h4>
                <p>
                  <strong>Make Your Fly Easy is NOT responsible for any hacking or cyber-attack.</strong>{' '}
                  Safeguarding office computers, mobile phones, Wi-Fi routers, antivirus software,
                  admin passwords, and staff login credentials is strictly the client&apos;s
                  responsibility. MYFE assumes zero liability for losses, downtime, account
                  hijacking, ransomware, viruses, phishing, or unauthorized access resulting from
                  external hackers, third-party hosting outages, compromised user devices, or shared
                  credentials.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2 border-l-4 border-l-violet-600">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  4. Theft, Employee Fraud &amp; Internal Misuse
                </h4>
                <p>
                  <strong>
                    Make Your Fly Easy is NOT responsible for any kind of theft, fraud, or internal
                    misuse.
                  </strong>{' '}
                  This includes physical theft of client hardware (laptops, desktops, servers, POS
                  devices, phones), cash or stock misappropriation, unauthorized invoice tampering,
                  or data copying/deletion carried out by the client&apos;s employees, drivers,
                  partners, or unauthorized office visitors. Managing staff permissions, revoking
                  former employee access, and protecting physical premises remain exclusively with
                  the client.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2 border-l-4 border-l-violet-600">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  5. Mandatory Client Data Backup &amp; Zero Data-Loss Liability
                </h4>
                <p>
                  <strong>
                    We build a Data Backup / Export option directly into your software, and you must
                    always take regular backups. Make Your Fly Easy is NOT responsible for any data
                    loss.
                  </strong>{' '}
                  It is the client&apos;s strict responsibility to run daily or periodic backups and
                  store copies safely offline or in separate secure storage. MYFE is completely
                  exempt from liability for any deleted, corrupted, overwritten, or lost business,
                  accounting, customs, or legal records due to hardware failure, formatting,
                  electricity surges, human error, or failure to maintain backups.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  6. Intellectual Property, Licensing &amp; Payment Terms
                </h4>
                <p>
                  Unless explicitly transferred in a signed written contract, all software
                  architecture, designs, source code, and proprietary workflows remain the
                  intellectual property of Make Your Fly Easy, licensed solely for the client&apos;s
                  authorized business operations. Unauthorized copying, reselling, sharing, or
                  reverse-engineering is strictly prohibited. Project milestones, annual renewals,
                  hosting/third-party usage fees, and support terms follow the agreed commercial
                  quotation/invoice.
                </p>
              </div>

              <div className="glass-inner-tile rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#141129]">
                  7. Accuracy Verification, Liability Cap, Indemnification &amp; Law
                </h4>
                <p>
                  Our software assists business operations; final verification of customs GD
                  declarations, tax figures, legal petitions, payroll, and bank vouchers before
                  submission rests solely with the client. To the maximum extent permitted by law,
                  MYFE shall never be liable for indirect damages, loss of business profits, fines,
                  or missed deadlines, and any direct liability in any dispute shall strictly not
                  exceed the actual service fee paid by the client to MYFE for the current billing
                  cycle. The client agrees to indemnify and hold Make Your Fly Easy harmless against
                  any third-party claims, penalties, or disputes arising from the client&apos;s
                  business operations or unlawful use. Governed by the laws of Pakistan under the
                  exclusive jurisdiction of courts in Karachi, Sindh.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Strip Inside Modal */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-violet-200/70 bg-white/90 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-[#5B5480]">
            Questions? Contact Karachi HQ at <strong className="text-[#141129]">info@myfe.org</strong>{' '}
            or WhatsApp <strong className="text-[#141129]">+92-339-8884124</strong>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="btn-standard-primary rounded-xl px-5 py-2 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
