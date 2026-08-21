import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { KycOptionCard } from '../../components/registration/DocumentCaptureCard';
import { useRegistration } from '../../context/RegistrationContext';
import { Trans } from 'react-i18next';
import { icKycUser, icMeporm, icDoc } from '../../constants/assets';

function KycIllustration() {
  return (
    <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
      <img
        src={icKycUser}
        alt="KYC Verification"
        className="h-28 w-28 object-contain drop-shadow-md"
      />
    </div>
  );
}

export default function KycStep() {
  const navigate = useNavigate();
  const { updateData } = useRegistration();

  alert(window.location.href)

  const handleSelect = (method) => {
    updateData({ kycMethod: method });
    const lang = localStorage.getItem('lang') || 'la';
    if (method === 'meporm') {
      navigate('/security-questions?type=meporm&lang=' + lang);
    } else {
      navigate('/documents?lang=' + lang);
    }
  };

  return (
    <div className="min-h-dvh bg-white">
      <PageContainer>
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-6">
          <KycIllustration />

          <h1 className="mt-8 text-center text-2xl font-bold text-gray-900"><Trans>KYC</Trans></h1>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            <Trans>The use of electronic wallet products requires proper user authentication to identify the true owner of the wallet and comply with MSP policies</Trans>
          </p>

          <div className="mt-8 space-y-4">
            <KycOptionCard
              icon={icMeporm}
              title={<Trans>Verify by APB Meporm</Trans>}
              subtitle={<Trans>Reference your account APB Meporm already</Trans>}
              onClick={() => handleSelect('meporm')}
            />
            <KycOptionCard
              icon={icDoc}
              title={<Trans>Verify by Documents</Trans>}
              subtitle={<Trans>Identity document, Census number, Passport</Trans>}
              onClick={() => handleSelect('documents')}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

