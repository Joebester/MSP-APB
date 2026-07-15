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

    } else {
      // console.log(updates.dateOfBirth)
      if (isUnder18(updates.dateOfBirth)) {
        setData((prev) => ({ ...prev, ...updates, alertDOB: true }));
      } else {
        if (updateData.dateOfBirth !== '' || updates.dateOfBirth !== undefined) {
          setData((prev) => ({ ...prev, ...updates, alertDOB: false }));
        }

      }

      if (updates?.email != '') {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates?.email);
        setData((prev) => ({ ...prev, ...updates, emailAlert: ok }))
      }
      if (updates.firstName == '') {
        setData((prev) => ({ ...prev, ...updates, alertFirstName: true }))
      }
      if (updates.lastName == '') {
        setData((prev) => ({ ...prev, ...updates, alertLastName: true }))
      }
      if (updates.firstNameEn == '') {
        setData((prev) => ({ ...prev, ...updates, alertFirstNameEn: true }))
      }
      if (updates.lastNameEn == '') {
        setData((prev) => ({ ...prev, ...updates, alertLastNameEn: true }))
      }
      if (updates.province == '') {
        setData((prev) => ({ ...prev, ...updates, alertProvince: true }))
      }
      if (updates.district == '') {
        setData((prev) => ({ ...prev, ...updates, alertDistrict: true }))
      }
      if (updates.village == '') {
        setData((prev) => ({ ...prev, ...updates, alertVillage: true }))
      }
      if (updates.occupation == '') {
        setData((prev) => ({ ...prev, ...updates, alertOccupation: true }))
      }
      // console.log(isUnder18(updates.dateOfBirth))
      // if (isUnder18(updates.dateOfBirth)) {
      //   setData((prev) => ({ ...prev, ...updates, alertDOB: true }))
      // }
      // else {
      //   setData((prev) => ({ ...prev, ...updates, alertDOB: false }))
      // }
    }

    // if (updates?.phone?.length <= 10) {
    //   setData((prev) => ({ ...prev, ...updates }));
    // }
    // if (updates?.otp?.length <= 4) {
    //   setData((prev) => ({ ...prev, ...updates }));
    // }
    // if (updates?.country?.length <= 0) {
    //   setData((prev) => ({ ...prev, ...updates }));
    // }
  }, []);

  const updateDataSelect = useCallback((updates) => {

    // console.log(updates)
  }, []);


  const fullName = useMemo(() => {
    const parts = [data.title, data.firstName, data.lastName].filter(Boolean);
    return parts.join(' ').toUpperCase();
  }, [data.title, data.firstName, data.lastName]);

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
