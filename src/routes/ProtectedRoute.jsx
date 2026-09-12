import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';
import { getLanguageFromUrl } from '../utils/lang';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const tokenFromUrl = searchParams.get('token') || searchParams.get('accessToken');
  const token = tokenFromUrl || getAccessToken();
  const hasToken = Boolean(token);


  if (!hasToken) {
    const lang = getLanguageFromUrl();
    console.warn('[ProtectedRoute] Access denied: No access token found. Redirecting to home.');
    return <Navigate to={`/?langCode=${lang}`} replace />;
  }

  return children;
}
