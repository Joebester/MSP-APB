import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { KycOptionCard } from '../../components/registration/DocumentCaptureCard';
import { useRegistration } from '../../context/RegistrationContext';
import { Trans } from 'react-i18next';

import Meporm_Icon from '../../assets/icons/ic_meporm.png';
import Documents_Icon from '../../assets/icons/ic_doc.png';
import header_Icon from '../../assets/icons/ic_kyc_user.png';


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
        <div className="flex flex-1 flex-col px-4 py-6 sm:px-6">
          {/* <KycIllustration /> */}

          <div className="flex justify-end px-4 pt-4 sm:px-6 mb-6">
            <button
              type="button"
              onClick={() => navigate('/verify?lang=la')}
              className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={3.5} />
            </button>
          </div>

          <img src={header_Icon} alt="KYC Header" className="mx-auto h-20 w-auto" />

          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900"><Trans>KYC</Trans></h1>
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            <Trans>The use of electronic wallet products requires proper user authentication to identify the true owner of the wallet and comply with MSP policies</Trans>
          </p>

          <div className="mt-8 space-y-4">
            <KycOptionCard
              icon={<img src={Meporm_Icon} alt="Meporm Logo" className="h-10 w-auto" />}
              title={<Trans>Verify by APB Meporm</Trans>}
              subtitle={<Trans>Reference your account APB Meporm already</Trans>}
              onClick={() => handleSelect('meporm')}
            />
            <KycOptionCard
              icon={<img src={Documents_Icon} alt="Documents Logo" className="h-10 w-auto" />}
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
