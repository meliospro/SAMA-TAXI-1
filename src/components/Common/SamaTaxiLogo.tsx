import React, { useState } from 'react';
import samaTaxiLogoImg from '../../assets/images/sama_taxi_logo_1790551318945.jpg';
import samaAppIconImg from '../../assets/images/sama_taxi_app_icon_1790551328445.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'badge' | 'compact';
  showSubtitle?: boolean;
  className?: string;
}

/**
 * Official Brand Logo for Sama Taxi Kaolack
 * Incorporates the official generated brand asset, typography & Kaolack badge
 */
export const SamaTaxiLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: { img: 'w-7 h-7', text: 'text-xs', sub: 'text-[9px]', gap: 'gap-2' },
    md: { img: 'w-9 h-9', text: 'text-sm', sub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { img: 'w-12 h-12', text: 'text-lg', sub: 'text-xs', gap: 'gap-3' },
    xl: { img: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm', gap: 'gap-4' },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} select-none ${className}`}>
      {/* Brand Icon Badge */}
      <div className={`relative ${sizeClasses.img} rounded-xl overflow-hidden shadow-md ring-1 ring-amber-500/40 bg-neutral-900 shrink-0`}>
        {!imgError ? (
          <img
            src={samaAppIconImg}
            alt="Icône Sama Taxi Kaolack"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center font-black text-black">
            ST
          </div>
        )}
      </div>

      {variant !== 'compact' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black font-display tracking-tight text-white ${sizeClasses.text}`}>
              SAMA <span className="text-amber-400">TAXI</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30 font-mono tracking-wider">
              Kaolack
            </span>
          </div>

          {showSubtitle && (
            <span className={`text-slate-400 font-medium tracking-normal mt-0.5 ${sizeClasses.sub}`}>
              VTC & Moto Jakarta · 200F / 500m
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withRing?: boolean;
}

/**
 * Official Android Launcher App Icon
 */
export const SamaAppIcon: React.FC<IconProps> = ({
  size = 'md',
  className = '',
  withRing = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-16 h-16 rounded-[22px]',
    xl: 'w-24 h-24 rounded-[30px]',
  }[size];

  return (
    <div
      className={`relative ${sizeMap} overflow-hidden shrink-0 shadow-lg ${
        withRing ? 'ring-2 ring-amber-500/50 shadow-amber-500/10' : ''
      } bg-neutral-900 ${className}`}
    >
      {!imgError ? (
        <img
          src={samaAppIconImg}
          alt="Icône Sama Taxi Android"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black">
          🚕
        </div>
      )}
    </div>
  );
};

export default SamaTaxiLogo;
