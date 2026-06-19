import { Trans } from 'react-i18next';
import { Button } from '../ui/Button';

export function StepFooter({
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  nextDisabled = false,
  showBack = true,
  singleButton = false,
  singleLabel = 'Continue',
  onSingle,
}) {
  if (singleButton) {
    return (
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          <Button
            className="w-full"
            size="lg"
            onClick={onSingle}
            disabled={nextDisabled}
          >
            {singleLabel}
          </Button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-lg gap-3">
        {showBack && (
          <Button
            variant="secondary"
            className="flex-1"
            size="lg"
            onClick={onBack}
          >
            <Trans>{backLabel}</Trans>
          </Button>
        )}
        <Button
          className={showBack ? 'flex-1' : 'w-full'}
          size="lg"
          onClick={onNext}
          disabled={nextDisabled}
        >
          <Trans>{nextLabel}</Trans>
        </Button>
      </div>
    </footer>
  );
}
