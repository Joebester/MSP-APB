export function Input({
  label,
  required = false,
  helperText,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20 ${inputClassName}`}
        {...props}
      />
      {helperText && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
