import { X } from "lucide-react";
import { Trans } from "react-i18next";

export function OnboardingHeader({ onBack }) {
  return (
    <div className="relative border-b border-gray-200 px-4 py-6 text-center sm:px-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute right-5 top-10 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Back"
        >
          <X className="h-5 w-5" strokeWidth={3}/>
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        <Trans>Let&apos;s get you started</Trans>
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        <Trans>Enter the details to get going</Trans>
      </p>
    </div>
  );
}
