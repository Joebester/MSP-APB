import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeftRight, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageContainer } from '../../components/layout/PageContainer';
import { useRegistration } from '../../context/RegistrationContext';
import { useRegistrationStore } from '../../store/useRegistrationStore';
import { useTranslation, Trans } from 'react-i18next';
import { icAppMsp, icMeporm } from '../../constants/assets';

function MepormLogo() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 border border-gray-200 p-1.5 shadow-sm">
      <img src={icMeporm} alt="APB Meporm" className="h-full w-full object-contain" />
    </div>
  );
}

export default function KycMepormStep() {
  const navigate = useNavigate();
  const { fullName, data } = useRegistration();
  const { verifyMepom } = useRegistrationStore();
  const { t } = useTranslation();
  
  const [mepomId, setMepomId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!mepomId.trim()) return;
    setVerifying(true);
    setError(null);
    const success = await verifyMepom(mepomId.trim());
    setVerifying(false);
    if (success) {
      navigate('/success?type=kyc&kyc=meporm&langCode=' + (localStorage.getItem("lang") || 'la'));
    } else {
      setError(t('Identification failed. Please check your User ID and try again.'));
    }
  };

  return (
    <div className="min-h-dvh bg-white">
      <PageContainer>
        <div className="flex justify-end px-4 pt-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/kyc?langCode=' + (localStorage.getItem("lang") || 'la'))}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
            disabled={verifying}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-6 sm:px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 border border-gray-200 p-1.5 shadow-sm">
              <img src={icAppMsp} alt="MSP" className="h-full w-full object-contain" />
            </div>
            <ArrowLeftRight className="h-5 w-5 text-gray-800" />
            <MepormLogo />
          </div>


          <h1 className="mt-6 text-center text-lg font-bold text-gray-900">
            <Trans>MEPOM Instant Verification</Trans>
          </h1>
          <div className="mx-auto mt-2 h-px w-full max-w-xs bg-gray-200" />
          <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-gray-600">
            <Trans>Please enter your APB Meporm User ID below to instantly authenticate and activate your eWallet.</Trans>
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <h2 className="text-sm font-bold text-gray-700"><Trans>Account Information</Trans></h2>
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <Input
                label={t("Full name")}
                value={fullName || 'Test User'}
                readOnly
                inputClassName="bg-white"
              />
              <Input
                label={t("Customer Code")}
                value={data.customerCode}
                readOnly
                inputClassName="bg-white"
              />
              <Input
                label={t("MEPOM User ID")}
                placeholder={t("Enter MEPOM User ID")}
                value={mepomId}
                onChange={(e) => setMepomId(e.target.value)}
                required
                disabled={verifying}
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}
        </div>

        <footer className="flex gap-4 border-t border-gray-200 px-4 py-4 sm:px-6">
          <Button
            variant="secondary"
            className="flex-1"
            size="lg"
            onClick={() => navigate('/kyc?langCode=' + (localStorage.getItem("lang") || 'la'))}
            disabled={verifying}
          >
            {t("Back")}
          </Button>
          <Button
            className="flex-1 bg-msp-green hover:bg-msp-green/90 text-white"
            size="lg"
            onClick={handleVerify}
            disabled={!mepomId.trim() || verifying}
          >
            {verifying ? t("Verifying...") : t("Verify")}
          </Button>
        </footer>
      </PageContainer>
    </div>
  );
}
