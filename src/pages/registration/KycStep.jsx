import { useNavigate } from 'react-router-dom';
import { FileText, Sprout } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { KycOptionCard } from '../../components/registration/DocumentCaptureCard';
import { useRegistration } from '../../context/RegistrationContext';

function KycIllustration() {
  return (
    <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
      <div className="flex h-24 w-20 flex-col items-center justify-end rounded-full bg-sky-100 pb-2">
        <div className="h-10 w-10 rounded-full bg-sky-200" />
        <div className="mt-1 h-8 w-14 rounded-t-full bg-sky-300" />
      </div>
      <div className="absolute inset-4 border-2 border-red-400" />
      <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-msp-green text-white">
        ✓
      </div>
    </div>
  );
}

export default function KycStep() {
  const navigate = useNavigate();
  const { updateData } = useRegistration();

  const handleSelect = (method) => {
    updateData({ kycMethod: method });
    if (method === 'meporm') {
      navigate('/kyc/meporm');
    } else {
      navigate('/documents');
    }
  };

  return (
    <div className="min-h-dvh bg-white">
      <PageContainer>
        <div className="flex flex-1 flex-col px-4 py-8 sm:px-6">
          <KycIllustration />

          <h1 className="mt-8 text-center text-2xl font-bold text-gray-900">KYC</h1>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            The use of electronic wallet products requires proper user
            authentication to identify the true owner of the wallet and comply
            with MSP policies
          </p>

          <div className="mt-8 space-y-4">
            <KycOptionCard
              icon={
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <Sprout className="h-5 w-5 text-orange-600" />
                </div>
              }
              title="Verify by APB Meporm"
              subtitle="Reference your account APB Meporm already"
              onClick={() => handleSelect('meporm')}
            />
            <KycOptionCard
              icon={<FileText className="h-6 w-6 text-msp-green" />}
              title="Verify by Documents"
              subtitle="Identity document, Census number, Passport"
              onClick={() => handleSelect('documents')}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
