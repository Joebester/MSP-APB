import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const defaultState = {
  profileId: '',
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
  kycMethod: '',
  documentType: 'passport',
  documentNumber: '',
  documentIssueDate: '',
  documentExpirationDate: '',
  documentPhotoTaken: false,
  selfiePhotoTaken: false,
  videoShortTaken: false,
  securityAnswers: ['', '', ''],
  customerCode: 'US00001234638',
  pin: '',
  termsAccepted: false,
  confirmTermsAccepted: false,
};

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [data, setData] = useState(defaultState);

  const updateData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

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
