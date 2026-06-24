import { Camera, ChevronRight, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import photo_UploadIcon from '../../assets/icons/ic_kyc_1.png';
import photo_video_UploadIcon from '../../assets/icons/ic_kyc_2.png';

// function CornerBrackets() {
//   return (
//     <>
//       <span className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-teal-500" />
//       <span className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-teal-500" />
//       <span className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-teal-500" />
//       <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-teal-500" />
//     </>
//   );
// }

function DocumentIllustration({ variant = 'document' }) {
  return (
    <div className="relative mx-auto flex h-28 w-50 items-center justify-center mb-5">
      {/* <CornerBrackets /> */}
      {variant === 'document' ? (
        <img
          src={photo_UploadIcon}
          alt="Document Illustration"
          className="object-cover"
        />
      ) : (
        <img
          src={photo_video_UploadIcon}
          alt="Selfie Illustration"
          className="object-cover"
        />
      )}
    </div>
  );
}

export function DocumentCaptureCard({
  title,
  instruction,
  variant = 'document',
  actionLabel = 'Take Photo',
  actionType = 'photo',
  icon: customIcon,
  completed = false,
  onCapture,
}) {
  const Icon = customIcon || (actionType === 'video' ? Video : Camera);

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
            <Icon className="h-4 w-4" />
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
    </button>
  );
}
