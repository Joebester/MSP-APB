import { ChevronDown } from 'lucide-react';

export function Select({
  label,
  required = false,
  options = [],
  placeholder = 'Select an option',
  onSelect,
  className = '',
  ...props
}) {
  const handleChange = (e) => {
    const val = e.target.value;
    const match = options.find((o) => {
      const optVal = typeof o === 'object' && o !== null ? o.value : o;
      return String(optVal) === val;
    });
    const selectedLabel =
      typeof match === 'object' && match !== null ? match.label : match;

    onSelect?.({ value: val, label: selectedLabel ?? '' });
    props.onChange?.(e); // still forward native onChange if provided
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20"
          {...props}
          onChange={handleChange}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const isObject = typeof option === 'object' && option !== null;
            const val = isObject ? option.value : option;
            const optLabel = isObject ? option.label : option;
            return (
              <option key={String(val)} value={String(val)}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}