import { Trans } from "react-i18next";

export function CountrySelector({ value, onChange }) {
  const options = [
    { id: 'laos', label: 'Laos' },
    { id: 'international', label: 'International' },
  ];

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-gray-700">
        <Trans>The country where you live permanently</Trans>''
      </p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                isSelected
                  ? 'border-amber-300 bg-amber-50 text-gray-900'
                  : 'border-gray-200 bg-gray-100 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ? 'border-msp-green' : 'border-gray-400'
                }`}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-msp-green" />
                )}
              </span>
              <Trans>{option.label}</Trans>
            </button>
          );
        })}
      </div>
    </div>
  );
}
