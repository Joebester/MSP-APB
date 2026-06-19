import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Checkbox } from '../../components/ui/Checkbox';
import { TERMS_TEXT } from '../../constants/registration';
import { useRegistration } from '../../context/RegistrationContext';

export default function TermsPage() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();

  return (
    <div className="min-h-dvh bg-gray-50">
      <AppHeader />
      <PageContainer>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <h1 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Terms and Conditions
          </h1>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
            {TERMS_TEXT.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 pt-4 sm:px-6">
          <Checkbox
            label="I agree with the terms and conditions"
            checked={data.termsAccepted}
            onChange={(e) => updateData({ termsAccepted: e.target.checked })}
            className="mb-4"
          />
        </div>

        <StepFooter
          singleButton
          singleLabel="Continue"
          onSingle={() => navigate('/register/confirm')}
          nextDisabled={!data.termsAccepted}
        />
      </PageContainer>
    </div>
  );
}
