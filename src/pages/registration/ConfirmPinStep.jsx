import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { PinIndicators } from '../../components/registration/PinDisplay';
import { PinKeypad } from '../../components/registration/PinKeypad';
import { useRegistration } from '../../context/RegistrationContext';
import { usePinEntry } from '../../hooks/usePinEntry';

export default function ConfirmPinStep() {
  const navigate = useNavigate();
  const { data, updateData } = useRegistration();
  const { pin, pinLength, addDigit, removeDigit, isComplete } = usePinEntry();

  useEffect(() => {
    if (isComplete) {
      if (pin !== data.pin) {
        alert('PIN does not match. Please try again.');
        window.location.reload();
        return;
      }
      updateData({ confirmPin: pin });
      const timer = setTimeout(() => navigate('/register/terms'), 400);
      return () => clearTimeout(timer);
    }
  }, [isComplete, pin, data.pin, updateData, navigate]);

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* <AppHeader /> */}
      <PageContainer className="justify-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Confirm your PIN Code</h2>
          </div>
          <PinIndicators length={pinLength} filled={pin.length} />
          <PinKeypad
            onDigit={addDigit}
            onBackspace={removeDigit}
            disabled={isComplete}
          />
        </div>
      </PageContainer>
    </div>
  );
}
