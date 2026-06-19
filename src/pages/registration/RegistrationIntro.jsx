import { useNavigate } from 'react-router-dom';
import { Camera, Globe, IdCard, Smartphone, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/registration/GradientBackground';
import { MspLogo } from '../../components/brand/MspLogo';
import { Trans } from 'react-i18next'
import logo from '../../../Ui-image/MSP.png'

const requirements = [
  { icon: Globe, label: 'Internet' },
  { icon: Smartphone, label: 'Phone number' },
  { icon: IdCard, label: 'Identity document' },
  { icon: Camera, label: 'Document recording' },
];

export default function RegistrationIntro() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-6 sm:px-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-1 text-white transition hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

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
          <div className='h-16 w-20 shrink-0'><img src={logo} /></div>
          {/* <MspLogo variant="hero" className="h-16 w-20 shrink-0" /> */}
        </div>

        <ul className="mt-10 space-y-5 sm:mt-14">
          {requirements.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-4">
              <Icon className="h-6 w-6 shrink-0 text-white" strokeWidth={1.5} />
              <span className="text-base font-medium text-white sm:text-lg"><Trans>{label}</Trans></span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-4 pb-4 pt-10">
          <Button
            variant="white"
            size="lg"
            className="w-full gap-1"
            onClick={() => navigate('/register/policy?lang=' + localStorage.getItem("lang"))}
          >
            <Trans>Register Now</Trans> <span aria-hidden="true">&gt;</span>
          </Button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-2 text-center text-sm font-medium text-white transition hover:text-white/80"
          >
            <Trans>Cancel</Trans>
          </button>
        </div>
      </div>
    </GradientBackground>
  );
}
