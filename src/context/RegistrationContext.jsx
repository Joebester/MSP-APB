import dayjs from 'dayjs';
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
  MidleName: '',
  firstNameEn: '',
  lastNameEn: '',
  MidleNameEn: '',
  occupation: '',
  dateOfBirth: dayjs().subtract(20, 'year').format('YYYY-MM-DD'),
  district: '',
  province: '',
  village: '',
  roadLineOne: '',
  roadLineTwo: '',
  kycMethod: '',
  documentType: 'passport',
  documentNumber: '',
  documentIssueDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
  documentExpirationDate: dayjs().add(5, 'year').format('YYYY-MM-DD'),
  docFile: null,
  selfieFile: null,
  videoFile: null,
  documentPhotoTaken: false,
  selfiePhotoTaken: false,
  videoShortTaken: false,
  securityAnswers: ['', '', ''],
  customerCode: 'US00001234638',
  pin: '',
  termsAccepted: false,
  confirmTermsAccepted: false,
  otpActive: false,
  emailAlert: false,
  alertFirstName: false,
  alertLastName: false,
  alertMiddleName: false,
  alertFirstNameEn: false,
  alertLastNameEn: false,
  alertMiddleNameEn: false,
  alertProvince: false,
  alertOccupation: false,
  alertDistrict: false,
  alertVillage: false,
  alertDOB: true,
  provinceName: "",
  districtName: "",
  villageName: "",
  isEmailRegister: localStorage.getItem('is_email_register') === 'true',
};

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [data, setData] = useState(defaultState);

  function isUnder18(dateOfBirth) {
    try {
      const dob = new Date(dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      // not had birthday yet this year → subtract 1
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (isNaN(age)) {
        return false
      } else {
        return age < 18;
      }

    } catch (error) {
      return false
    }
  }

  const updateData = useCallback((updates) => {
    if (updates?.phone?.length > 10 || updates?.otp?.length > 6 || updates?.emailOtp?.length > 6) {
      return;
    }

    setData((prev) => {
      const next = { ...prev, ...updates };

      if (updates.dateOfBirth !== undefined) {
        next.alertDOB = isUnder18(updates.dateOfBirth);
      }

      if (updates.email !== undefined && updates.email !== '') {
        next.emailAlert = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email);
      }

      if (updates.firstName === '') next.alertFirstName = true;
      if (updates.lastName === '') next.alertLastName = true;
      if (updates.firstNameEn === '') next.alertFirstNameEn = true;
      if (updates.lastNameEn === '') next.alertLastNameEn = true;
      if (updates.province === '') next.alertProvince = true;
      if (updates.district === '') next.alertDistrict = true;
      if (updates.village === '') next.alertVillage = true;
      if (updates.occupation === '') next.alertOccupation = true;

      return next;
    });
  }, []);

  const updateDataSelect = useCallback((updates) => {

    // console.log(updates)
  }, []);


  const fullName = useMemo(() => {
    const parts = [data.title, data.firstName, data.MidleName, data.lastName].filter(Boolean);
    return parts.join(' ').toUpperCase();
  }, [data.title, data.firstName, data.MidleName, data.lastName]);

  const value = useMemo(
    () => ({
      data,
      updateData,
      updateDataSelect,
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
