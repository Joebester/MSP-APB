import { useNavigate } from 'react-router-dom';
import { Check, MessageCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/registration/GradientBackground';

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-6 sm:px-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="rounded-lg p-1 text-white transition hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <Check className="h-10 w-10 text-msp-green" strokeWidth={2.5} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Registration Successfully
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
            System may take time to verify the information, you can use other
            services, except for financial transactions
          </p>

          <p className="mt-8 text-sm text-white">Contact the nearby service center</p>
          <a
            href="#location"
            className="mt-1 text-sm font-bold text-white underline"
          >
            Location &gt;&gt;
          </a>

          <MessageCircle
            className="mt-6 h-10 w-10 text-msp-neon"
            strokeWidth={1.5}
          />
        </div>

        <div className="pb-4 pt-8">
          <Button
            variant="white"
            size="lg"
            className="w-full gap-1"
            onClick={() => navigate('/')}
          >
            Let&apos;s Start <span aria-hidden="true">&gt;</span>
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
