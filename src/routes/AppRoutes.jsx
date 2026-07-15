import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import ConfirmRegistration from '../pages/registration/ConfirmRegistration';
import GeneralDetailsStep from '../pages/registration/GeneralDetailsStep';
import RegistrationIntro from '../pages/registration/RegistrationIntro';
import RegistrationSuccess from '../pages/registration/RegistrationSuccess';
import SetPinStep from '../pages/registration/SetPinStep';
import PolicyPage from '../pages/registration/PolicyPage';
import TermsPage from '../pages/registration/TermsPage';
import VerifyStep from '../pages/registration/VerifyStep';
import ConfirmSubmitStep from '../pages/registration/ConfirmSubmitStep';
import DocumentsUploadStep from '../pages/registration/DocumentsUploadStep';
import KycStep from '../pages/registration/KycStep';
import SecurityQuestionsStep from '../pages/registration/SecurityQuestionsStep';
import KycMepormStep from '../pages/registration/KycMepormStep';
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
      {/* <Route path="/" element={<Navigate to="/" replace />} /> */}

      <Route path="/" element={<RegistrationIntro />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/verify" element={<VerifyStep />} />
      <Route path="/details" element={<GeneralDetailsStep />} />
      <Route path="/kyc" element={<KycStep />} />
      <Route path="/kyc/meporm" element={<KycMepormStep />} />
      <Route path="/documents" element={<DocumentsUploadStep />} />
      <Route path="/pin" element={<SetPinStep />} />
      <Route path="/security-questions" element={<SecurityQuestionsStep />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/confirm" element={<ConfirmRegistration />} />
      <Route path="/review" element={<ConfirmSubmitStep />} />
      <Route path="/success" element={<RegistrationSuccess />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
