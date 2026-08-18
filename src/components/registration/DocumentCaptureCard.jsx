import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, CheckCircle2, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import photo_kyc from '../../assets/icons/ic_kyc_1.png';
import video_kyc from '../../assets/icons/ic_kyc_2.png';

const MIN_VIDEO_DURATION_SECONDS = 5;

export function DocumentCaptureCard({
  title,
  instruction,
  variant = 'document',
  actionLabel,
  browseLabel,
  actionType = 'photo', // 'photo' | 'video'
  completed,
  onCapture,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const browseInputRef = useRef(null);
  const isVideo = actionType === 'video';
  const [showVideoNotice, setShowVideoNotice] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      onCapture(file);
    }
  };

  const handleTakeClick = () => {
    if (isVideo) {
      setShowVideoNotice(true);
      return;
    }
    inputRef.current?.click();
  };

  const confirmVideoNotice = () => {
    setShowVideoNotice(false);
    inputRef.current?.click();
  };

  return (
    <div className={`rounded-xl border bg-white p-4 ${completed ? 'border-msp-green' : 'border-gray-200'}`}>
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

      <input
        ref={browseInputRef}
        type="file"
        accept={isVideo ? 'video/*' : 'image/*'}
        onChange={handleFileChange}
        className="hidden"
      />

      <img src={isVideo ? video_kyc : photo_kyc} alt="KYC" className="mx-auto mt-4 h-32 w-auto" />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleTakeClick}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
            completed
              ? 'border-msp-green/200 bg-msp-green/10 text-msp-green'
              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isVideo ? <Video className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          {completed ? t('Retake') : actionLabel || t('Take Photo')}
        </button>

        <button
          type="button"
          onClick={() => browseInputRef.current?.click()}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
            completed
              ? 'border-msp-green/200 bg-msp-green/10 text-msp-green'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {browseLabel || (isVideo ? t('Choose video') : t('Choose photo'))}
        </button>
      </div>

      {showVideoNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 text-center">
            <Video className="mx-auto h-8 w-8 text-msp-green" />
            <h3 className="mt-3 text-sm font-bold text-gray-900">
              {t('Record at least {{seconds}} seconds', { seconds: MIN_VIDEO_DURATION_SECONDS })}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {t('Please record for at least {{seconds}} seconds before stopping.', { seconds: MIN_VIDEO_DURATION_SECONDS })}
            </p>
            <Button className="mt-4 w-full" onClick={confirmVideoNotice}>
              {t('OK')}
            </Button>
          </div>
        </div>
      )}
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