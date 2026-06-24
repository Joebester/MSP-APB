import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/layout/AppHeader';
import { PageContainer } from '../../components/layout/PageContainer';
import { PinHeader, PinIndicators } from '../../components/registration/PinDisplay';
import { PinKeypad } from '../../components/registration/PinKeypad';
import { useRegistration } from '../../context/RegistrationContext';
import { usePinEntry } from '../../hooks/usePinEntry';

export default function SetPinStep() {
  const navigate = useNavigate();
  const { updateData } = useRegistration();
  const { pin, pinLength, addDigit, removeDigit, isComplete } = usePinEntry();

  useEffect(() => {
    
    
    if (isComplete) {
      updateData({ pin });
      const timer = setTimeout(() => navigate('/register/confirm-pin'), 400);
      return () => clearTimeout(timer);
    }
  }, [isComplete, pin, updateData, navigate]);

  return (
    <div className="min-h-dvh bg-gray-50">
      <AppHeader />
      <PageContainer className="justify-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-10 sm:px-6">
          <PinHeader />
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
