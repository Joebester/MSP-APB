import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, X } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { KycOptionCard } from '../../components/registration/DocumentCaptureCard';
import { useRegistration } from '../../context/RegistrationContext';

import kyc_header_icon from '../../assets/icons/ic_kyc_user.png';
import kyc_meporm_icon from '../../assets/icons/ic_meporm.png';
import kyc_document_icon from '../../assets/icons/ic_doc.png';

import { Button } from '../../components/ui/Button';


function KycIllustration() {
  return (
    <div className="relative mx-auto flex h-auto w-20 items-center justify-center">
      <img
        src={kyc_header_icon}
        alt="KYC Illustration"
        className="object-cover"
      />
    </div>
  );
}

export default function KycStep() {
  const navigate = useNavigate();
  const { updateData } = useRegistration();

  const handleSelect = (method) => {
    updateData({ kycMethod: method });
    if (method === 'meporm') {
      navigate('/register/kyc/meporm');
    } else {
      navigate('/register/documents');
    }
  };

  return (
    <div className="min-h-dvh bg-white">
      <PageContainer>

        <div className="flex flex-1 flex-col px-4 py-12 sm:px-6">
          <div className="flex justify-end mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-fit bg-none rounded-full transition"
              onClick={() => navigate(-1)}
            >
              <X className="h-auto w-6 text-gray-500" strokeWidth={3} />
            </Button>
          </div>

          <KycIllustration />

          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">KYC</h1>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            The use of electronic wallet products requires proper user
            authentication to identify the true owner of the wallet and comply
            with MSP policies
          </p>

          <div className="mt-8 space-y-4">
            <KycOptionCard
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <img src={kyc_meporm_icon} alt="Meporm Icon" className="object-cover h-10 w-10" />
                </div>
              }
              title="Verify by APB Meporm"
              subtitle="Reference your account APB Meporm already"
              onClick={() => handleSelect('meporm')}
            />
            <KycOptionCard
              icon={
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <img src={kyc_document_icon} alt="Document Icon" className="object-cover h-10 w-10" />
                </div>
              }
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
