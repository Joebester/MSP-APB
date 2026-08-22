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
import KycCheckPage from '../pages/registration/KycCheckPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getLanguageFromUrl } from '../utils/lang';

export function AppRoutes() {
  const url = useParams();
  const { i18n } = useTranslation();
  const search = window.location.search;
  const [lang, setLang] = useState(() => getLanguageFromUrl());

  useEffect(() => {
    const supported = ['en', 'la'];
    const params = new URLSearchParams(window.location.search);
    let langParam = params.get('langCode') || params.get('lang');

    if(langParam === "LA"){
        langParam = "la"
    }else if (langParam === "EN"){
        langParam = "en"
    }


    if (langParam && supported.includes(langParam)) {
      setLang(langParam);
      i18n.changeLanguage(langParam);
      localStorage.setItem("lang", langParam);
    } else {
      try {
        const fallback = search.split("=")[1];
        if (fallback && supported.includes(fallback)) {
          setLang(fallback);
          i18n.changeLanguage(fallback);
          localStorage.setItem("lang", fallback);
        }
      } catch (error) {
        setLang("la");
        localStorage.setItem("lang", "la");
      }
    }

    const params1 = new URLSearchParams(window.location.search);
    const tokenParam = params1.get('token') || params.get('accessToken');
    if (tokenParam) {
      localStorage.setItem('access_token', tokenParam);
    }

    const profileParam = params1.get('profileId') || params1.get('profile');
    if (profileParam) {
      localStorage.setItem('register_profile', JSON.stringify(profileParam));
    }
    
  }, [lang, i18n, search]);

  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<RegistrationIntro />} />
      <Route path="/register" element={<RegistrationIntro />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/verify" element={<VerifyStep />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/register/terms" element={<TermsPage />} />
      <Route path="/details" element={<GeneralDetailsStep />} />
      <Route path="/pin" element={<SetPinStep />} />
      <Route path="/security-questions" element={<SecurityQuestionsStep />} />
      <Route path="/confirm" element={<ConfirmRegistration />} />
      <Route path="/review" element={<ConfirmSubmitStep />} />

      {/* Protected Token-Required Routes */}
      <Route
        path="/kyc-check"
        element={
          <ProtectedRoute>
            <KycCheckPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KycStep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc/meporm"
        element={
          <ProtectedRoute>
            <KycMepormStep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentsUploadStep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <RegistrationSuccess />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
