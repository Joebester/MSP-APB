import { createContext, useContext, useMemo, useState } from 'react';

const defaultState = {
  country: 'laos',
  phone: '',
  otp: '',
  email: '',
  emailOtp: '',
  title: 'Mr',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  district: '',
  province: '',
  village: '',
  pin: '',
  termsAccepted: false,
  confirmTermsAccepted: false,
};

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [data, setData] = useState(defaultState);

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const fullName = useMemo(() => {
    const parts = [data.title, data.firstName, data.lastName].filter(Boolean);
    return parts.join(' ').toUpperCase();
  }, [data.title, data.firstName, data.lastName]);

  const value = useMemo(
    () => ({
      data,
      updateData,
      fullName,
      reset: () => setData(defaultState),
    }),
    [data, fullName],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return context;
}
