import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { OnboardingHeader } from '../../components/registration/OnboardingHeader';
import { StepIndicator } from '../../components/registration/StepIndicator';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';

export default function ConfirmSubmitStep() {
  const navigate = useNavigate();
  const { data } = useRegistration();
  const { confirmRegistration, confirming } = useRegistrationStore();

  const handleConfirm = async () => {
    const success = await confirmRegistration(data.profileId);
    if (success) {
      navigate('/register/success');
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <PageContainer>
        <OnboardingHeader />
        <StepIndicator step={4} totalSteps={4} label="Confirm & Submit" />

        <div className="flex-1 px-4 pb-6 sm:px-6">
          <h2 className="text-base font-bold text-gray-900">Review & Confirm</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            Please review your registration details carefully before submitting.
            Ensure all information is accurate and up to date. Once submitted,
            your application will be processed based on the information provided.
          </p>
        </div>

        <StepFooter
          onBack={() => navigate('/register/confirm')}
          onNext={handleConfirm}
          nextLabel={confirming ? "Submitting..." : "Continue"}
          nextDisabled={confirming}
        />
      </PageContainer>
    </div>
  );
}
