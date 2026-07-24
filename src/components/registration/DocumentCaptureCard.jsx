import { useRef } from 'react';
import { Camera, CheckCircle2, Video } from 'lucide-react';
import photo_kyc from '../../assets/icons/ic_kyc_1.png';
import video_kyc from '../../assets/icons/ic_kyc_2.png';

export function DocumentCaptureCard({
  title,
  instruction,
  variant = 'document',
  actionLabel,
  actionType = 'photo', // 'photo' | 'video'
  completed,
  onCapture,
}) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
    e.target.value = '';
  };

  const isVideo = actionType === 'video';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {instruction && (
            <p className="mt-1 text-xs text-gray-500">{instruction}</p>
          )}
        </div>
        {completed && (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-msp-green" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={isVideo ? 'video/*' : 'image/*'}
        capture={variant === 'selfie' ? 'user' : 'environment'}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <img src={isVideo ? video_kyc : photo_kyc} alt="KYC" className="mx-auto mt-4 h-32 w-auto" />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
          completed
            ? 'border-msp-green/200 bg-msp-green/10 text-msp-green'
            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
        }`}
      >
        {isVideo ? <Video className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {completed ? 'Retake' : actionLabel || 'Take Photo'}
      </button>
    </div>
  );
}

export function KycOptionCard({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-msp-green hover:bg-msp-green/5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      </div>
    </button>
  );
}