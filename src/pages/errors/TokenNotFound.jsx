import { ShieldAlert } from 'lucide-react';
import { Trans } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/registration/GradientBackground';

export default function TokenNotFound() {
  const handleClose = () => {
    if (window.AndroidInterface?.closeWebview) {
      window.AndroidInterface.closeWebview();
    } else if (window.webkit?.messageHandlers?.closeWebview) {
      window.webkit.messageHandlers.closeWebview.postMessage({});
    } else {
      window.location.reload();
    }
  };

  return (
    <GradientBackground>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-6 sm:px-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 h-24 w-24 animate-pulse rounded-full bg-white/20 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg shadow-white/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-red-500">
                <ShieldAlert className="h-9 w-9 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
            <Trans>Access Token Not Found</Trans>
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
            <Trans>We could not verify your session because no access token was provided. Please reopen this page from the MSP application.</Trans>
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-12 bg-white/20" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <div className="h-px w-12 bg-white/20" />
          </div>

          <Button variant="white" size="lg" className="mt-8 w-full max-w-xs" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
