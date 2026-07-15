import { useNavigate } from 'react-router-dom';
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
  const { confirmRegistration, confirming } = useRegistrationStore();

  const stored = localStorage.getItem('register_profile'); // '"71A8...:4E2C..."'
  const raw = JSON.parse(stored); // → "71A8...:4E2C..." (quotes removed)
  const u_id = aesDecrypt(raw);

  const handleConfirm = async () => {

    const success = await confirmRegistration(u_id);
    if (success) {
      navigate('/success?lang=' + localStorage.getItem("lang"));
    }
  };

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
          onBack={() => navigate('/confirm')}
          onNext={handleConfirm}
          nextLabel={confirming ? "Submitting..." : "Continue"}
          nextDisabled={confirming}
        />
      </PageContainer>
    </div>
  );
}
