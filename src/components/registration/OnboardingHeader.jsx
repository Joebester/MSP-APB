import { Trans } from "react-i18next";

export function OnboardingHeader() {
  return (
    <div className="border-b border-gray-200 px-4 py-6 text-center sm:px-6">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        <Trans>Let&apos;s get you started</Trans>
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        <Trans>Enter the details to get going</Trans>
      </p>
    </div>
  );
}
