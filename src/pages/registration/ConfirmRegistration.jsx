import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { StepFooter } from '../../components/layout/StepFooter';
import { Checkbox } from '../../components/ui/Checkbox';
import { InfoRow, InfoSection } from '../../components/registration/InfoRow';
import { useRegistration } from '../../context/RegistrationContext';

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const { data, updateData, fullName } = useRegistration();

  const contactValue = data.country === 'laos' ? data.phone : data.email;

  return (
    <div className="min-h-dvh bg-gray-50">
      <AppHeader />
      <PageContainer>
        <div className="px-4 py-6 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900">Register</h1>
          <div className="mt-1 h-1 w-12 bg-msp-green" />
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            Please check your information and then confirm to sign up as a new
            user of MSP Wallet.
          </p>
        </div>

        <div className="flex-1 bg-gray-50 px-4 py-6 sm:px-6">
          <div className="space-y-8">
            <InfoSection title="Applicant details">
              <InfoRow label="Full name:" value={fullName} />
              <InfoRow
                label={data.country === 'laos' ? 'Phone number:' : 'Email:'}
                value={contactValue}
              />
              <InfoRow label="Date of birth:" value={formatDate(data.dateOfBirth)} />
            </InfoSection>

            <InfoSection title="Present address">
              <InfoRow label="Province:" value={data.province} />
              <InfoRow label="District:" value={data.district} />
              <InfoRow label="Village:" value={data.village || 'null'} />
            </InfoSection>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6">
          <div className="flex justify-center">
            <Checkbox
              checked={data.confirmTermsAccepted}
              onChange={(e) =>
                updateData({ confirmTermsAccepted: e.target.checked })
              }
              label={
                <span className="text-sm text-gray-900">
                  Accept all terms,{' '}
                  <Link
                    to="/register/terms"
                    className="font-semibold text-blue-600 underline"
                  >
                    Details
                  </Link>
                </span>
              }
            />
          </div>
        </div>

        <StepFooter
          singleButton
          singleLabel="Register"
          onSingle={() => navigate('/register/success')}
          nextDisabled={!data.confirmTermsAccepted}
        />
      </PageContainer>
    </div>
  );
}
