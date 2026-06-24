import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import GeneralDetailsStep from '../pages/registration/GeneralDetailsStep';
import RegistrationIntro from '../pages/registration/RegistrationIntro';
import RegistrationSuccess from '../pages/registration/RegistrationSuccess';
import SetPinStep from '../pages/registration/SetPinStep';
import PolicyPage from '../pages/registration/PolicyPage';
import TermsPage from '../pages/registration/TermsPage';
import VerifyStep from '../pages/registration/VerifyStep';
import DocumentsUploadStep from '../pages/registration/DocumentsUploadStep';
import KycStep from '../pages/registration/KycStep';
import KycMepormStep from '../pages/registration/KycMepormStep';
import ConfirmPinStep from '../pages/registration/ConfirmPinStep';
import ConfirmRegistration from '../pages/registration/ConfirmRegistration';
import ConfirmSubmitStep from '../pages/registration/ConfirmSubmitStep';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function AppRoutes() {
  const url = useParams();
  const { i18n } = useTranslation();
  const search = window.location.search
  const [lang, setLang] = useState("la")

  useEffect(() => {
    const supported = ['en', 'la'];
    try {
      setLang(search.split("=")[1])
      if (lang && supported.includes(lang)) {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang)
      }
    } catch (error) {
      setLang("la")
      localStorage.setItem("lang", "la")
    }
  }, [lang, i18n]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />

      <Route path="/register" element={<RegistrationIntro />} />
      <Route path="/register/policy" element={<PolicyPage />} />
      <Route path="/register/verify" element={<VerifyStep />} />
      <Route path="/register/details" element={<GeneralDetailsStep />} />
      <Route path="/register/kyc" element={<KycStep />} />
      <Route path="/register/kyc/meporm" element={<KycMepormStep />} />
      <Route path="/register/documents" element={<DocumentsUploadStep />} />
      <Route path="/register/pin" element={<SetPinStep />} />
      <Route path="/register/confirm-pin" element={<ConfirmPinStep />} />
      <Route path="/register/terms" element={<TermsPage />} />
      <Route path="/register/confirm" element={<ConfirmRegistration />} />
      <Route path="/register/review" element={<ConfirmSubmitStep />} />
      <Route path="/register/success" element={<RegistrationSuccess />} />

      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}
