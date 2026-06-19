export function MspLogo({ className = 'h-8 w-8', variant = 'header' }) {
  if (variant === 'hero') {
    return (
      <div className={`relative ${className}`} aria-hidden="true">
        <svg viewBox="0 0 80 64" className="h-full w-full" fill="none">
          <ellipse cx="28" cy="36" rx="22" ry="18" stroke="#7CFC00" strokeWidth="2.5" fill="none" />
          <ellipse cx="48" cy="28" rx="22" ry="18" stroke="#7CFC00" strokeWidth="2.5" fill="none" />
          <text
            x="40"
            y="34"
            textAnchor="middle"
            fill="#7CFC00"
            fontSize="14"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            MSP
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 36 36" className="h-full w-full" fill="none">
        <circle cx="14" cy="20" r="10" stroke="#7CFC00" strokeWidth="2" fill="none" />
        <circle cx="22" cy="16" r="10" stroke="#7CFC00" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}
