import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeftRight, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageContainer } from '../../components/layout/PageContainer';
import { useRegistration } from '../../context/RegistrationContext';

import msp_logo from '../../assets/icons/ic_app_msp.png';
import meporm_logo from '../../assets/icons/ic_meporm.png';

function MepormLogo() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-msp-green shadow-sm">
      <SproutIcon />
    </div>
  );
}

function SproutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
      <path d="M12 2C8 6 6 9 6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2-6-6-10zm0 14c-2.2 0-4-1.8-4-4 0-1.5.8-3.5 4-7.5 3.2 4 4 6 4 7.5 0 2.2-1.8 4-4 4z" />
    </svg>
  );
}

export default function KycMepormStep() {
  const navigate = useNavigate();
  const { fullName, data } = useRegistration();

  return (
    <div className="min-h-dvh bg-white">
      <PageContainer>
        <div className="flex justify-end px-4 pt-4 mb-5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/register/kyc')}
            className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-6 sm:px-6">
          <div className="flex items-center justify-center gap-4">                    
            <img src={msp_logo} alt="MSP Logo" className="object-cover h-auto w-14" />             
            <ArrowLeftRight className="h-5 w-5 text-gray-800" />
            <img src={meporm_logo} alt="Meporm Logo" className="object-cover h-auto w-14" />           
          </div>

          <h1 className="mt-6 text-center text-lg font-bold text-gray-900">
            KYC Verification Required
          </h1>
          <div className="mx-auto mt-2 h-px w-full max-w-xs bg-gray-200" />
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            You have registered for an MSP Wallet account and submitted a
            verification request. Please complete your identity verification on
            Meporm
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="text-sm font-bold text-gray-700">User Information</h2>
            <div className="mt-3 space-y-4 border-t border-gray-200 pt-4">
              <Input
                label="Full name"
                value={fullName || 'MR HXHJS MMM'}
                readOnly
                inputClassName="bg-white"
              />
              <Input
                label="Customer Code"
                value={data.customerCode}
                readOnly
                inputClassName="bg-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Identification failed
            </div>
          </div>
        </div>

        <footer className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <Button
            variant="secondary"
            className="w-full text-teal-700"
            size="lg"
            onClick={() => navigate('/register/kyc')}
          >
            Close
          </Button>
        </footer>
      </PageContainer>
    </div>
  );
}
