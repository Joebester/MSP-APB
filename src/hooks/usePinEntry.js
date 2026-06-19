import { useState } from 'react';

const PIN_LENGTH = 6;

export function usePinEntry(onComplete) {
  const [pin, setPin] = useState('');

  const addDigit = (digit) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === PIN_LENGTH && onComplete) {
      onComplete(next);
    }
  };

  const removeDigit = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const clearPin = () => setPin('');

  return {
    pin,
    pinLength: PIN_LENGTH,
    addDigit,
    removeDigit,
    clearPin,
    isComplete: pin.length === PIN_LENGTH,
  };
}
