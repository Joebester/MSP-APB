import { Navigate, useLocation } from 'react-router-dom';
import { getLanguageFromUrl } from '../utils/lang';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const tokenFromUrl = searchParams.get('token') || searchParams.get('accessToken');
  const tokenFromStorage = localStorage.getItem('access_token');

  const token = tokenFromUrl || tokenFromStorage;
  const hasToken = Boolean(token && token !== 'null' && token !== 'undefined');

  if (!hasToken) {
    const lang = getLanguageFromUrl();
    console.warn('[ProtectedRoute] Access denied: No access token found. Redirecting to home.');
    return <Navigate to={`/?langCode=${lang}`} replace />;
  }

  return children;
}
