const variants = {
  primary:
    'bg-msp-green text-white hover:bg-msp-green/90 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-gray-200 text-msp-teal hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'border border-msp-green text-msp-green bg-transparent hover:bg-msp-green/5',
  white:
    'bg-white text-msp-teal hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-white hover:bg-white/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl font-bold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
