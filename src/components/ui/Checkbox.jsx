import { Check } from 'lucide-react';

export function Checkbox({ label, checked, onChange, className = '', id }) {
  const checkboxId =
    id ||
    (typeof label === 'string'
      ? label.replace(/\s+/g, '-').toLowerCase()
      : 'checkbox');

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex cursor-pointer items-center gap-2.5 ${className}`}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="h-5 w-5 rounded border-2 border-gray-300 bg-white transition peer-checked:border-msp-green peer-checked:bg-msp-green" />
        <Check
          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100"
          strokeWidth={3}
        />
      </span>
      {label && (
        <span
          className={
            typeof label === 'string'
              ? 'text-sm font-semibold text-gray-900'
              : 'text-sm text-gray-900'
          }
        >
          {label}
        </span>
      )}
    </label>
  );
}
