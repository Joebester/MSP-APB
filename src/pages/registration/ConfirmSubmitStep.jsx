import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';
import { Trans } from 'react-i18next';
import { aesDecrypt } from '../../utils/crypto';

export default function ConfirmSubmitStep() {
  const navigate = useNavigate();
  const { data } = useRegistration();
  const { confirmRegistration, confirming, uploadDocument, submitKyc } = useRegistrationStore();
  const [submittingKyc, setSubmittingKyc] = useState(false);

  const stored = localStorage.getItem('register_profile'); // '"71A8...:4E2C..."'
  const raw = stored ? JSON.parse(stored) : null; // → "71A8...:4E2C..." (quotes removed)
  const u_id = raw ? aesDecrypt(raw) : '';

  const params = new URLSearchParams(window.location.search);
  const isKycMode = params.get('type') === 'kyc';
  const lang = params.get('lang') || localStorage.getItem('lang') || 'la';

  const handleConfirm = async () => {
    if (isKycMode) {
      setSubmittingKyc(true);
      const typeMap = {
        passport: 1,
        id_card: 2,
        census: 3,
      };
      const typeId = typeMap[data.documentType] || 1;
      const rfDocNo = data.documentNumber;
      const exp = data.documentExpirationDate || '2030-12-31';

      // 1. Upload Cover
      const coverOk = await uploadDocument(data.docFile, typeId, rfDocNo, exp, 'COVER');
      if (!coverOk) {
        setSubmittingKyc(false);
        return;
      }

      // 2. Upload Main (selfie/back)
      const mainOk = await uploadDocument(data.selfieFile, typeId, rfDocNo, exp, 'MAIN');
      if (!mainOk) {
        setSubmittingKyc(false);
        return;
      }

      // 3. Upload Video (if selected)
      if (data.videoFile) {
        await uploadDocument(data.videoFile, typeId, rfDocNo, exp, 'VIDEO');
      }

      // 4. Submit for review
      const submitOk = await submitKyc();
      setSubmittingKyc(false);

      if (submitOk) {
        navigate(`/success?type=kyc&lang=${lang}`);
      }
    } else {
      const success = await confirmRegistration(u_id);
      if (success) {
        navigate(`/security-questions?lang=${lang}`);
      }
    }
  };

  const isPending = confirming || submittingKyc;

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={4} totalSteps={4} label={<Trans>Confirm & Submit</Trans>} />

        <div className="flex-1 px-4 pb-6 sm:px-6">
          <h2 className="text-base font-bold text-gray-900"><Trans>Review & Confirm</Trans></h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            <Trans>Review text</Trans>
          </p>
        </div>

        <StepFooter
          onBack={() => navigate(isKycMode ? `/documents?lang=${lang}` : '/confirm')}
          onNext={handleConfirm}
          nextLabel={isPending ? "Submitting..." : "Continue"}
          nextDisabled={isPending}
        />
      </PageContainer>
    </div>
  );
}
