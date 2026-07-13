// import { Camera, ChevronRight, Video } from 'lucide-react';
// import { Button } from '../ui/Button';
// import Picture_Icon from '../../assets/icons/ic_kyc_1.png';
// import PicVid_Icon from '../../assets/icons/ic_kyc_2.png';

// // function CornerBrackets() {
// //   return (
// //     <>
// //       <span className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-teal-500" />
// //       <span className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-teal-500" />
// //       <span className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-teal-500" />
// //       <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-teal-500" />
// //     </>
// //   );
// // }

// function DocumentIllustration({ variant = 'document' }) {
//   return (
//     <div className="relative mx-auto flex items-center justify-center">
//       {/* <CornerBrackets /> */}
//       {variant === 'document' ? (
//         <img src={Picture_Icon} alt="Document Illustration" className="h-auto w-40" />
//       ) : (
//         <img src={PicVid_Icon} alt="Document Illustration" className="h-auto w-40" />
//       )}
//     </div>
//   );
// }

// export function DocumentCaptureCard({
//   title,
//   instruction,
//   variant = 'document',
//   actionLabel = 'Take Photo',
//   actionType = 'photo',
//   completed = false,
//   onCapture,
// }) {
//   const Icon = actionType === 'video' ? Video : Camera;

//   return (
//     <section className="space-y-2">
//       <h3 className="text-sm font-bold text-gray-900">{title}</h3>
//       {instruction && (
//         <p className="text-xs text-gray-500">{instruction}</p>
//       )}
//       <div className="rounded-xl bg-gray-100 px-4 py-6">
//         <DocumentIllustration variant={variant} />
//         <div className="mt-4 flex justify-center">
//           <Button
//             type="button"
//             onClick={onCapture}
//             className={`gap-2 bg-teal-600 px-6 hover:bg-teal-700 ${completed ? 'opacity-80' : ''}`}
//           >
//             <Icon className="h-4 w-4" />
//             {completed ? 'Retake' : actionLabel}
//           </Button>
//         </div>
//         {completed && (
//           <p className="mt-2 text-center text-xs font-medium text-msp-green">
//             Captured successfully
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }

// export function KycOptionCard({ icon, title, subtitle, onClick }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-msp-green/40 hover:bg-gray-50"
//     >
//       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
//         {icon}
//       </div>
//       <div className="min-w-0 flex-1">
//         <p className="font-bold text-gray-900">{title}</p>
//         <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
//       </div>
//       <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
//     </button>
//   );
// }

import { useRef } from 'react';
import { Camera, CheckCircle2, Video } from 'lucide-react';

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
    // เคลียร์ value ทุกครั้ง เผื่อ user เลือกไฟล์เดิมซ้ำแล้ว onChange ไม่ยิง
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

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
          completed
            ? 'border-msp-green/30 bg-msp-green/5 text-msp-green'
            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
        }`}
      >
        {isVideo ? <Video className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {completed ? 'Retake' : actionLabel || 'Take Photo'}
      </button>
    </div>
  );
}

// ใช้ในหน้า KycStep สำหรับ card เลือก pathway (ของเดิมที่ import อยู่แล้ว)
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