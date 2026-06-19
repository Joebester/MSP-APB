import { Delete } from 'lucide-react';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
];

export function PinKeypad({ onDigit, onBackspace, disabled = false }) {
  return (
    <div className="mx-auto grid max-w-xs grid-cols-3 gap-4 px-4">
      {KEYS.flat().map((key, index) => {
        if (key === '') {
          return <div key={`empty-${index}`} />;
        }

        if (key === 'backspace') {
          return (
            <button
              key="backspace"
              type="button"
              disabled={disabled}
              onClick={onBackspace}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 sm:h-20 sm:w-20"
              aria-label="Delete"
            >
              <Delete className="h-5 w-5" />
            </button>
          );
        }

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onDigit(key)}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-xl font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-40 sm:h-20 sm:w-20"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
