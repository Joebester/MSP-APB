import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Globe, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/registration/GradientBackground';
import { MspLogo } from '../../components/brand/MspLogo';
import { Trans } from 'react-i18next';
import { icDoc, icCamera } from '../../constants/assets';
import { getLanguageFromUrl } from '../../utils/lang';

const requirements = [
  { type: 'lucide', icon: Globe, label: 'Internet' },
  { type: 'lucide', icon: Smartphone, label: 'Phone number' },
  { type: 'asset', iconSrc: icDoc, label: 'Identity document' },
  { type: 'asset', iconSrc: icCamera, label: 'Document recording' },
];

export default function RegistrationIntro() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('register_profile');
    getLanguageFromUrl();
  }, []);

  const lang = getLanguageFromUrl();

  return (
    <GradientBackground>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-6 sm:px-8">
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white sm:text-4xl"><Trans>register</Trans></h1>
            <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
              <Trans>For MSP eWallet registration</Trans>
              <br />
              <Trans>Please follow the instruction below</Trans>
            </p>
            <div className="mt-4 h-0.5 w-16 bg-white" />
          </div>
          <div className="flex shrink-0 items-center">
            <MspLogo className="h-16 w-auto" />
          </div>
        </div>

        <ul className="mt-10 space-y-5 sm:mt-14">
          {requirements.map(({ type, icon: Icon, iconSrc, label }) => (
            <li key={label} className="flex items-center gap-4">
              {type === 'asset' ? (
                <img src={iconSrc} alt={label} className="h-6 w-6 shrink-0 object-contain brightness-0 invert" />
              ) : (
                <Icon className="h-6 w-6 shrink-0 text-white" strokeWidth={1.5} />
              )}
              <span className="text-base font-medium text-white sm:text-lg"><Trans>{label}</Trans></span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-4 pb-4 pt-10">
          <Button
            variant="white"
            size="lg"
            className="w-full gap-1"
            onClick={() => navigate('/policy?langCode=' + lang)}
          >
            <Trans>Register Now</Trans> <span aria-hidden="true">&gt;</span>
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}

