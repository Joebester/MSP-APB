export const readTokenFromUrl = () => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const tokenParam = params.get('token') || params.get('accessToken');

  if (tokenParam && tokenParam !== 'null' && tokenParam !== 'undefined') {
    localStorage.setItem('access_token', tokenParam);
    return tokenParam;
  }

  const stored = localStorage.getItem('access_token');
  if (stored && stored !== 'null' && stored !== 'undefined') {
    return stored;
  }

  return null;
};

export const getAccessToken = () => readTokenFromUrl();
