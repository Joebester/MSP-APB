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
import SecurityQuestionsStep from '../pages/registration/SecurityQuestionsStep';
import ConfirmRegistration from '../pages/registration/ConfirmRegistration';
import ConfirmSubmitStep from '../pages/registration/ConfirmSubmitStep';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getLanguageFromUrl } from '../utils/lang';

export function AppRoutes() {
  const url = useParams();
  const { i18n } = useTranslation();
  const search = window.location.search;
  const [lang, setLang] = useState(() => getLanguageFromUrl());

  useEffect(() => {
    const currentLang = getLanguageFromUrl();
    setLang(currentLang);
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }

    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token') || params.get('accessToken');
    if (tokenParam) {
      localStorage.setItem('access_token', tokenParam);
    }

    const profileParam = params.get('profileId') || params.get('profile');
    if (profileParam) {
      localStorage.setItem('register_profile', JSON.stringify(profileParam));
    }
  }, [i18n, search]);

  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/" replace />} /> */}

      <Route path="/" element={<RegistrationIntro />} />
      <Route path="/register" element={<RegistrationIntro />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/verify" element={<VerifyStep />} />
      <Route path="/details" element={<GeneralDetailsStep />} />
      <Route path="/kyc" element={<KycStep />} />
      <Route path="/kyc/meporm" element={<KycMepormStep />} />
      <Route path="/documents" element={<DocumentsUploadStep />} />
      <Route path="/pin" element={<SetPinStep />} />
      <Route path="/security-questions" element={<SecurityQuestionsStep />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/register/terms" element={<TermsPage />} />
      <Route path="/confirm" element={<ConfirmRegistration />} />
      <Route path="/review" element={<ConfirmSubmitStep />} />
      <Route path="/success" element={<RegistrationSuccess />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
