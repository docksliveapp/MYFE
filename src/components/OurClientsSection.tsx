import React from 'react';

export interface ClientCompany {
  name: string;
  monogram: string;
  sector: string;
}

export const OUR_CLIENTS: ClientCompany[] = [
  { name: 'Docks Pvt Ltd', monogram: 'DP', sector: 'Maritime & Logistics' },
  { name: 'Truckit Pvt Ltd', monogram: 'TP', sector: 'Freight & Fleet Operations' },
  { name: 'Vantage Shipping Line', monogram: 'VS', sector: 'Shipping & Cargo Line' },
  { name: 'Muhib International SMC-Pvt Ltd', monogram: 'MI', sector: 'International Trade' },
  { name: 'Sealion Logistics', monogram: 'SL', sector: 'Customs & Supply Chain' },
  { name: 'Rising Impex', monogram: 'RI', sector: 'Import & Export' },
  { name: 'Montina Trading Corporation', monogram: 'MT', sector: 'Commercial Trading' },
  { name: 'Mak Group of Companies', monogram: 'MG', sector: 'Enterprise Conglomerate' },
  { name: 'Mak Aviation', monogram: 'MA', sector: 'Aviation Services' },
];

interface OurClientsSectionProps {
  id?: string;
}

export const OurClientsSection: React.FC<OurClientsSectionProps> = ({ id = 'our-clients' }) => {
  return (
    <div id={id} className="space-y-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
          Our Clients
        </p>
        <h2 className="section-fluid-heading font-extrabold text-[#17122E] mt-1.5">
          Trusted by Leading Companies
        </h2>
        <p className="body-fluid-copy text-[#47416A] mt-2.5">
          Shipping lines, logistics operators, trading houses, corporate groups, and aviation
          enterprises relying on our business software.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {OUR_CLIENTS.map((client, index) => (
          <li
            key={client.name}
            className="glass-surface rounded-2xl px-5 py-4.5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div
              aria-hidden="true"
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F6F2FF] to-[#E9DFFF] border border-violet-200/80 flex items-center justify-center shrink-0 font-display text-sm font-extrabold text-royal-purple tracking-tight shadow-xs"
            >
              {client.monogram}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-[#5C5482] tabular-nums flex items-center gap-1.5">
                <span className="font-bold text-violet-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{client.sector}</span>
              </div>
              <div className="text-sm sm:text-[15px] font-extrabold text-[#17122E] leading-snug mt-0.5 break-words">
                {client.name}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
