import { IMaskInput } from 'react-imask';

export function InputMask({
  label,
  required = false,
  helperText,
  error,
  id,
  mask,
  onAccept,
  value,
  className = '',
  inputClassName = '',
  ...props
}) {
  const inputId = id || props.name;

  const inputClasses = `w-full rounded-lg border bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-200 focus:border-msp-green focus:ring-msp-green/20'
  } ${inputClassName}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {mask ? (
        <IMaskInput
          id={inputId}
          mask={mask}
          value={value}
          unmask={true}          // onAccept receives the raw (unmasked) value
          onAccept={onAccept}
          aria-required={required}
          aria-invalid={!!error}
          className={inputClasses}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          value={value}
          aria-required={required}
          aria-invalid={!!error}
          className={inputClasses}
          {...props}
        />
      )}
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}