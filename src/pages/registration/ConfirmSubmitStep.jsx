// import { useNavigate } from 'react-router-dom';
// import { PageContainer } from '../../components/layout/PageContainer';
// import { StepFooter } from '../../components/layout/StepFooter';
// import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
// import { StepIndicator } from '../../components/registration/StepIndicator';
// import { useRegistration } from '../../context/RegistrationContext';
// import { useRegistrationStore } from '../../store/useRegistrationStore';

// export default function ConfirmSubmitStep() {
//   const navigate = useNavigate();
//   const { data } = useRegistration();
//   const { confirmRegistration, confirming } = useRegistrationStore();

//   const handleConfirm = async () => {
//     const success = await confirmRegistration(data.profileId);
//     if (success) {
//       navigate('/success');
//     }
//   };

//   return (
//     <div className="min-h-dvh bg-gray-50">
//       <PageContainer>
//         <OnboardingHeader />
//         <StepIndicator step={4} totalSteps={4} label="Confirm & Submit" />

//         <div className="flex-1 px-4 pb-6 sm:px-6">
//           <h2 className="text-base font-bold text-gray-900">Review & Confirm</h2>
//           <p className="mt-4 text-sm leading-relaxed text-gray-700">
//             Please review your registration details carefully before submitting.
//             Ensure all information is accurate and up to date. Once submitted,
//             your application will be processed based on the information provided.
//           </p>
//         </div>

//         <StepFooter
//           onBack={() => navigate('/confirm')}
//           onNext={handleConfirm}
//           nextLabel={confirming ? "Submitting..." : "Continue"}
//           nextDisabled={confirming}
//         />
//       </PageContainer>
//     </div>
//   );
// }


import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Input } from '../../components/ui/Input';
import { DocumentCaptureCard } from '../../components/registration/DocumentCaptureCard';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { DOCUMENT_TYPES } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';

export default function DocumentsUploadStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { uploadDocument, submitDocuments, uploadingDoc, submittingDocs, error } =
    useRegistrationStore();
  const docConfig = DOCUMENT_TYPES[data.documentType] || DOCUMENT_TYPES.passport;

  // เก็บไฟล์จริงไว้ใน local state (ไฟล์ไม่ควรเก็บใน RegistrationContext เพราะไม่ใช่ serializable data ปกติ)
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const requiredFieldsFilled = docConfig.fields
    .filter((field) => field.required)
    .every((field) => data[field.key]?.trim());

  const canProceed =
    requiredFieldsFilled &&
    data.documentPhotoTaken &&
    data.selfiePhotoTaken &&
    data.videoShortTaken &&
    !uploadingDoc &&
    !submittingDocs;

  const handleDocTypeChange = (e) => {
    updateData({
      documentType: e.target.value,
      documentNumber: '',
      documentIssueDate: '',
      documentExpirationDate: '',
      documentPhotoTaken: false,
      selfiePhotoTaken: false,
      videoShortTaken: false,
    });
    setDocumentFile(null);
    setSelfieFile(null);
    setVideoFile(null);
  };

  const handleDocumentCapture = (file) => {
    setDocumentFile(file);
    updateData({ documentPhotoTaken: true });
  };

  const handleSelfieCapture = (file) => {
    setSelfieFile(file);
    updateData({ selfiePhotoTaken: true });
  };

  const handleVideoCapture = (file) => {
    setVideoFile(file);
    updateData({ videoShortTaken: true });
  };

  const handleNext = async () => {
    setSubmitError(null);

    // ⚠️ สมมติฐาน: DOCUMENT_TYPES[key] มี field `typeId` (ตัวเลขที่ backend ต้องการ)
    // ถ้ายังไม่มีใน constants/registration.js ต้องเพิ่ม typeId ให้แต่ละประเภทเอกสารก่อน
    const typeId = docConfig.typeId;

    // Step A1 — upload หน้าเอกสารหลัก (COVER)
    const coverUploaded = await uploadDocument({
      typeId,
      rfDocNo: data.documentNumber,
      exp: data.documentExpirationDate,
      pageType: 'COVER',
      file: documentFile,
    });
    if (!coverUploaded) {
      setSubmitError('อัปโหลดรูปเอกสารไม่สำเร็จ กรุณาลองใหม่');
      return;
    }

    // Step A1 (ซ้ำ) — upload เซลฟี่ถือเอกสาร ใช้ pageType แยกต่างหาก (MAIN)
    const mainUploaded = await uploadDocument({
      typeId,
      rfDocNo: data.documentNumber,
      exp: data.documentExpirationDate,
      pageType: 'MAIN',
      file: selfieFile,
    });
    if (!mainUploaded) {
      setSubmitError('อัปโหลดรูปเซลฟี่ไม่สำเร็จ กรุณาลองใหม่');
      return;
    }

    // ⚠️ หมายเหตุ: guideline ระบุแค่ pageType COVER/MAIN สำหรับรูปภาพ
    // ไม่ได้ระบุ endpoint สำหรับวิดีโอไว้ชัดเจน จึงยังไม่ส่ง videoFile ไป backend ตรงนี้
    // ถ้ามี field/endpoint เฉพาะสำหรับวิดีโอ (เช่น pageType: 'VIDEO' หรือ endpoint แยก) แจ้งมาได้เลย จะเพิ่มให้

    // Step A2 — ส่งเข้า review
    const submitted = await submitDocuments();
    if (submitted) {
      navigate('/security-questions');
    } else {
      setSubmitError('ส่งเอกสารเพื่อตรวจสอบไม่สำเร็จ กรุณาลองใหม่');
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={3} totalSteps={4} label="Documents Upload" />

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6 sm:px-6">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Document details</h2>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                Select type document<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={data.documentType}
                  onChange={handleDocTypeChange}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-msp-green focus:ring-2 focus:ring-msp-green/20"
                >
                  {Object.entries(DOCUMENT_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>

            {docConfig.fields.map((field) =>
              field.type === 'date' ? (
                <DatePicker
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  value={data[field.key] || ''}
                  onChange={(val) => updateData({ [field.key]: val })}
                />
              ) : (
                <Input
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={data[field.key]}
                  onChange={(e) => updateData({ [field.key]: e.target.value })}
                />
              )
            )}
          </section>

          <DocumentCaptureCard
            title="Upload document"
            variant="document"
            completed={data.documentPhotoTaken}
            onCapture={handleDocumentCapture}
          />

          <DocumentCaptureCard
            title="Take photo with document"
            instruction="Take a selfie holding your passport open to the photo page"
            variant="selfie"
            completed={data.selfiePhotoTaken}
            onCapture={handleSelfieCapture}
          />

          <DocumentCaptureCard
            title="Take video shorts"
            instruction="Take a video shorts holding your document"
            variant="selfie"
            actionLabel="Take Video"
            actionType="video"
            completed={data.videoShortTaken}
            onCapture={handleVideoCapture}
          />

          {(error || submitError) && (
            <p className="text-center text-xs text-red-500">{submitError || error}</p>
          )}
        </div>

        <StepFooter
          onBack={() => navigate('/kyc')}
          onNext={handleNext}
          nextDisabled={!canProceed}
          nextLabel={uploadingDoc || submittingDocs ? 'Uploading...' : undefined}
        />
      </PageContainer>
    </div>
  );
}