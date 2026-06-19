export function StepIndicator({ step, totalSteps, label }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-msp-green text-sm font-bold text-msp-green">
          {step}
        </span>
        <span className="text-sm font-bold text-gray-900">{label}</span>
      </div>
      <span className="text-sm text-gray-500">
        {step} of {totalSteps}
      </span>
    </div>
  );
}
