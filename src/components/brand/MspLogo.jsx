import { icAppMsp, icApb } from '../../constants/assets';

export function MspLogo({ className = 'h-8 w-auto', variant = 'msp', alt = 'MSP Logo' }) {
  const src = variant === 'apb' ? icApb : icAppMsp;

  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}

