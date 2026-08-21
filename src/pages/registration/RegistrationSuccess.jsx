import { useNavigate } from 'react-router-dom';
import { Check, MessageCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/registration/GradientBackground';
import { Trans } from 'react-i18next';

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  const search = window.location.search;
  const isKyc = search.includes('type=kyc');
  const isMeporm = search.includes('kyc=meporm');

  const handleFinish = () => {
    if (window.AndroidInterface?.closeWebview) {
      window.AndroidInterface.closeWebview();
    } else if (window.webkit?.messageHandlers?.closeWebview) {
      window.webkit.messageHandlers.closeWebview.postMessage({});
    } else {
      navigate('/');
    }
  };

  return (
    <GradientBackground>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-6 sm:px-8">
        <div className="flex justify-end">
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <Check className="h-10 w-10 text-msp-green" strokeWidth={2.5} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            {isKyc ? (
              isMeporm ? <Trans>Verification Successful</Trans> : <Trans>Documents Submitted</Trans>
            ) : (
              <Trans>Registration Successfully</Trans>
            )}
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
            {isKyc ? (
              isMeporm ? (
                <Trans>Your identity has been verified via APB Meporm. Your eWallet is now active and ready to use.</Trans>
              ) : (
                <Trans>Your documents have been submitted for admin review. You will be notified once the verification is complete.</Trans>
              )
            ) : (
              <Trans>System may</Trans>
            )}
          </p>

          {!isKyc && (
            <>
              <p className="mt-8 text-sm text-white"><Trans>Contact the nearby service center</Trans></p>
              <a
                href="#location"
                className="mt-1 text-sm font-bold text-white underline"
              >
                <Trans>Location</Trans> &gt;&gt;
              </a>
            </>
          )}

          <MessageCircle
            className="mt-6 h-10 w-10 text-msp-neon"
            strokeWidth={1.5}
          />
        </div>

        <div className="pb-4 pt-8">
          <Button
            variant="white"
            size="lg"
            className="w-full gap-1 font-bold text-teal-800"
            onClick={handleFinish}
          >
            {isKyc ? <Trans>Done</Trans> : <Trans>Let&apos;s Start</Trans>}{' '}
            <span aria-hidden="true">&gt;</span>
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
