import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';
import { getLanguageFromUrl } from '../utils/lang';

export function ProtectedRoute({ children }) {
  const hasToken = Boolean(getAccessToken());

  if (!hasToken) {
    const lang = getLanguageFromUrl();
    console.warn('[ProtectedRoute] Access denied: No access token found. Redirecting to home.');
    return <Navigate to={`/?langCode=${lang}`} replace />;
  }

  return children;
}
