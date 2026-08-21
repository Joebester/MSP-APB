import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { icDoc, icKyc2, icKyc3, icCamera, icKyc1 } from '../../constants/assets';

function CornerBrackets() {
  return (
    <>
      <span className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-teal-500" />
      <span className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-teal-500" />
      <span className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-teal-500" />
      <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-teal-500" />
    </>
  );
}

function DocumentIllustration({ variant = 'document' }) {
  let assetSrc = icDoc;
  if (variant === 'selfie') assetSrc = icKyc2;
  else if (variant === 'video') assetSrc = icKyc3;
  else if (variant === 'kyc1') assetSrc = icKyc1;

  return (
    <div className="relative mx-auto flex h-28 w-44 items-center justify-center p-2">
      <CornerBrackets />
      <img
        src={assetSrc}
        alt={variant}
        className="max-h-20 max-w-full object-contain drop-shadow-sm"
      />
    </div>
  );
}

export function DocumentCaptureCard({
  title,
  instruction,
  variant = 'document',
  actionLabel = 'Take Photo',
  actionType = 'photo',
  completed = false,
  onCapture,
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      {instruction && (
        <p className="text-xs text-gray-500">{instruction}</p>
      )}
      <div className="rounded-xl bg-gray-100 px-4 py-6">
        <DocumentIllustration variant={variant} />
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            onClick={onCapture}
            className={`gap-2 bg-teal-600 px-6 hover:bg-teal-700 ${completed ? 'opacity-80' : ''}`}
          >
            <img src={icCamera} alt="Camera" className="h-4 w-4 object-contain brightness-0 invert" />
            {completed ? 'Retake' : actionLabel}
          </Button>
        </div>
        {completed && (
          <p className="mt-2 text-center text-xs font-medium text-msp-green">
            Captured successfully
          </p>
        )}
      </div>
    </section>
  );
}

export function KycOptionCard({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-msp-green/40 hover:bg-gray-50"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 overflow-hidden p-2">
        {typeof icon === 'string' ? (
          <img src={icon} alt="" className="h-8 w-8 object-contain" />
        ) : (
          icon
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
    </button>
  );
}

