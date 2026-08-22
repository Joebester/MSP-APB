import { useEffect, useState } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
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

function DocumentIllustration({ variant = 'document', file = null }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const isVideo = variant === 'video' || (file && file.type && file.type.startsWith('video/'));

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (typeof file === 'string') {
      setPreviewUrl(file);
      return;
    }

    if (file instanceof File || file instanceof Blob) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  let assetSrc = icDoc;
  if (variant === 'selfie') assetSrc = icKyc2;
  else if (variant === 'video') assetSrc = icKyc3;
  else if (variant === 'kyc1') assetSrc = icKyc1;

  if (previewUrl) {
    return (
      <div className="relative mx-auto flex min-h-[140px] max-w-sm items-center justify-center overflow-hidden rounded-xl border-2 border-teal-500/40 bg-gray-900/5 p-1 shadow-inner">
        {isVideo ? (
          <video
            src={previewUrl}
            controls
            playsInline
            className="max-h-48 w-full rounded-lg object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="max-h-48 max-w-full rounded-lg object-contain shadow-sm"
          />
        )}
      </div>
    );
  }

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
  file = null,
  onCapture,
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      {instruction && (
        <p className="text-xs text-gray-500">{instruction}</p>
      )}
      <div className="rounded-xl bg-gray-100 px-4 py-5 transition hover:bg-gray-100/90">
        <DocumentIllustration variant={variant} file={file} />
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            onClick={onCapture}
            className={`gap-2 bg-teal-600 px-6 hover:bg-teal-700 ${completed ? 'bg-teal-700' : ''}`}
          >
            <img src={icCamera} alt="Camera" className="h-4 w-4 object-contain brightness-0 invert" />
            {completed ? (variant === 'video' ? 'Retake Video' : 'Retake Photo') : actionLabel}
          </Button>
        </div>
        {completed && (
          <p className="mt-2 text-center text-xs font-semibold text-msp-green flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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

