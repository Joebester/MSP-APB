import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/registration/GradientBackground';
import { useKycCheckStore } from '../../store/useKycCheckStore';
import { useRegistration } from '../../context/RegistrationContext';
import { Trans } from 'react-i18next';

export default function KycCheckPage() {
  const navigate = useNavigate();
  const { checkKyc, loading, error } = useKycCheckStore();
  const { updateData } = useRegistration();
  const [checked, setChecked] = useState(false);
  const [kycComplete, setKycComplete] = useState(false);

  const lang = localStorage.getItem('lang') || 'la';

  useEffect(() => {
    let cancelled = false;

    const doCheck = async () => {
      const result = await checkKyc();
      if (cancelled) return;

      if (result) {
        const isDocVerified = result.verifiedDoc === true || result.verifiedDoc === 'true';
        const isQtVerified = result.verifiedQt === true || result.verifiedQt === 'true';

        if (isDocVerified && isQtVerified) {
          // KYC already verified — show thank you page with complete button
          setKycComplete(true);
          setChecked(true);
        } else {
          // KYC not yet verified — continue flow
          if (result.username) {
            updateData({ customerCode: result.username });
          }
          setChecked(true);
          // Auto-navigate to KYC option selection (Meporm or Documents)
          navigate(`/kyc?langCode=${lang}`, { replace: true });
        }
      } else {
        setChecked(true);
      }
    };

    doCheck();
    return () => { cancelled = true; };
  }, []);

  const handleFinish = () => {
    if (window.AndroidInterface?.closeWebview) {
      window.AndroidInterface.closeWebview();
    } else if (window.webkit?.messageHandlers?.closeWebview) {
      window.webkit.messageHandlers.closeWebview.postMessage({});
    } else {
      navigate('/');
    }
  };

  // Loading state
  if (loading || (!checked && !error)) {
    return (
      <GradientBackground>
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 py-6 sm:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-white" strokeWidth={2} />
              </div>
              <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-white/5" />
            </div>
            <p className="text-lg font-medium text-white/90">
              <Trans>Checking KYC status...</Trans>
            </p>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // Error state
  if (error && !kycComplete) {
    return (
      <GradientBackground>
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 py-6 sm:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm">
              <ShieldCheck className="h-10 w-10 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Error</h2>
              <p className="mt-2 max-w-xs text-sm text-white/80">{error}</p>
            </div>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // KYC already complete — Thank You modal
  if (kycComplete) {
    return (
      <GradientBackground>
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-6 sm:px-8">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {/* Success icon with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 h-24 w-24 animate-pulse rounded-full bg-white/20 blur-xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg shadow-white/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
                  <Check className="h-9 w-9 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Shield badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-300" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                <Trans>Verified</Trans>
              </span>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              <Trans>KYC Verified</Trans>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
              <Trans>Thank you for completing your KYC verification. Your identity has been verified successfully.</Trans>
            </p>

            {/* Decorative divider */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-12 bg-white/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <div className="h-px w-12 bg-white/20" />
            </div>
          </div>
        </div>
      </GradientBackground>
    );
  }

  // Fallback — should not reach here since non-verified auto-navigates
  return null;
}
