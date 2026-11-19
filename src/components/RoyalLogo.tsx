import React, { useState } from 'react';

export const OFFICIAL_LOGO_PATH = '/assets/aistudio/Logo_without_bg_229675aa.png';

export const RoyalLogo: React.FC<{ className?: string; idSuffix?: string }> = ({
  className = 'h-9 sm:h-10 w-auto',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <span
        aria-label="Make Your Fly Easy (MYFE)"
        className={`${className} aspect-square rounded-2xl bg-gradient-to-br from-[#F4F0FF] to-[#E6DCFF] border border-violet-300/70 inline-flex items-center justify-center font-display font-extrabold text-sm text-royal-purple select-none shrink-0`}
      >
        MYFE
      </span>
    );
  }

  return (
    <img
      src={OFFICIAL_LOGO_PATH}
      alt="Make Your Fly Easy (MYFE) Official Logo"
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={`${className} shrink-0 object-contain bg-transparent select-none transition-transform duration-200 group-hover:scale-[1.03]`}
    />
  );
};
