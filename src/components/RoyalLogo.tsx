import React from 'react';

export const OFFICIAL_LOGO_PATH = '/assets/aistudio/Logo_without_bg_229675aa.png';

export const RoyalLogo: React.FC<{ className?: string; idSuffix?: string }> = ({
  className = 'h-8 sm:h-9 w-auto',
}) => {
  return (
    <img
      src={OFFICIAL_LOGO_PATH}
      alt="Make Your Fly Easy (MYFE) Official Logo"
      className={`${className} shrink-0 object-contain bg-transparent select-none transition-transform duration-300 group-hover:scale-105`}
    />
  );
};
