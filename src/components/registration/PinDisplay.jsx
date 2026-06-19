import { Lock } from 'lucide-react';

export function PinIndicators({ length, filled }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <span
          key={index}
          className={`h-3 w-3 rounded-full border-2 transition ${
            index < filled
              ? 'border-msp-green bg-msp-green'
              : 'border-gray-300 bg-white'
          }`}
        />
      ))}
    </div>
  );
}

export function PinHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Lock className="h-7 w-7 text-gray-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold text-gray-900">Set your PIN Code</h2>
    </div>
  );
}
