import api from './API';

/**
 * Build an absolute gateway URL that bypasses the API base path.
 * Used with `baseURL: ''` for endpoints that live outside VITE_DEFUALT_API_URL.
 */
export const getGatewayUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = api.defaults.baseURL || '';

  if (base.startsWith('/')) {
    return normalizedPath;
  }

  try {
    const origin = new URL(base, window.location.origin).origin;
    return `${origin}${normalizedPath}`;
  } catch (e) {
    return normalizedPath;
  }
};
