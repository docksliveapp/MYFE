import React from 'react';

export interface ClientCompany {
  name: string;
  monogram: string;
}

export const OUR_CLIENTS: ClientCompany[] = [
  { name: 'Docks Pvt Ltd', monogram: 'DP' },
  { name: 'Truckit Pvt Ltd', monogram: 'TP' },
  { name: 'Vantage Shipping Line', monogram: 'VS' },
  { name: 'Muhib International SMC-Pvt Ltd', monogram: 'MI' },
  { name: 'Sealion Logistics', monogram: 'SL' },
  { name: 'Rising Impex', monogram: 'RI' },
  { name: 'Montina Trading Corporation', monogram: 'MT' },
  { name: 'Mak Group of Companies', monogram: 'MG' },
  { name: 'Mak Aviation', monogram: 'MA' },
];

interface OurClientsSectionProps {
  id?: string;
}

export const OurClientsSection: React.FC<OurClientsSectionProps> = ({ id = 'our-clients' }) => {
  return (
    <div id={id} className="space-y-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
          Our Clients
        </p>
        <h2 className="section-fluid-heading font-extrabold text-[#141129] mt-1.5">
          Trusted by Leading Companies
        </h2>
        <p className="body-fluid-copy text-[#47416A] mt-2">
          Shipping lines, logistics operators, trading houses, corporate groups, and aviation
          enterprises relying on our business software.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OUR_CLIENTS.map((client, index) => (
          <li
            key={client.name}
            className="glass-surface rounded-2xl px-5 py-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F4F0FF] to-[#E5D9FF] border border-violet-200/80 flex items-center justify-center shrink-0 font-display text-sm font-extrabold text-royal-purple tracking-tight shadow-xs"
            >
              {client.monogram}
            </div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-violet-700/80 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="text-sm sm:text-[15px] font-extrabold text-[#141129] leading-snug break-words">
                {client.name}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
