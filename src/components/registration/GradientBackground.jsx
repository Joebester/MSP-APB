export function GradientBackground({ children, className = '' }) {
  return (
    <div
      className={`relative min-h-dvh overflow-hidden bg-gradient-to-b from-msp-green-dark via-msp-green to-msp-green-light ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-20 -top-10 h-64 w-96 -rotate-12 bg-white/5" />
        <div className="absolute -left-10 top-20 h-48 w-80 -rotate-12 bg-white/5" />
        <div className="absolute left-10 top-40 h-56 w-72 -rotate-12 bg-white/5" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
