const TOKEN_KEY = 'access_token';

export function isValidToken(token) {
  return Boolean(token && token !== 'null' && token !== 'undefined');
}

/** Read token from URL first, persist it, then fall back to localStorage. */
export function getAccessToken() {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get('token') || params.get('accessToken');

  if (isValidToken(tokenFromUrl)) {
    localStorage.setItem(TOKEN_KEY, tokenFromUrl);
    return tokenFromUrl;
  }

  const tokenFromStorage = localStorage.getItem(TOKEN_KEY);
  return isValidToken(tokenFromStorage) ? tokenFromStorage : null;
}

export function setAccessToken(token) {
  if (isValidToken(token)) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}
