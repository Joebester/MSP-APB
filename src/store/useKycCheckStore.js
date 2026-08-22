import { create } from 'zustand';
import api from '../utils/API';

const getGatewayUrl = (path) => {
  const base = api.defaults.baseURL || '';
  if (base.startsWith('/')) {
    return path;
  }
  try {
    const origin = new URL(base, window.location.origin).origin;
    return `${origin}${path}`;
  } catch (e) {
    return path;
  }
};

export const useKycCheckStore = create((set) => ({
  loading: false,
  error: null,
  verifiedDoc: null,
  verifiedQt: null,
  username: null,

  checkKyc: async () => {
    set({ loading: true, error: null, verifiedDoc: null, verifiedQt: null, username: null });
    try {
      const token = localStorage.getItem('access_token');
      console.log('[KYC Check] Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
      console.log('[KYC Check] URL:', getGatewayUrl('/api/v1/msp/signup/check/kyc'));

      if (!token) {
        set({ error: 'No access token found', loading: false });
        return null;
      }

      const response = await api.get(getGatewayUrl('/api/v1/msp/signup/check/kyc'), {
        baseURL: '',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[KYC Check API] Response Status:', response.status);
      console.log('[KYC Check API] Response Data:', response.data);

      const header = response.data?.header;
      const body = response.data?.body;
      const code = header?.code;
      const ok = response.status === 200 && (code === '0000' || code === '00' || code === 200 || code === '200');

      if (ok && body) {
        const isEmail = body.email === true || body.email === 'true';
        set({
          verifiedDoc: body.verifiedDoc,
          verifiedQt: body.verifiedQt,
          username: body.username || null,
          email: isEmail,
          loading: false,
        });
        return {
          verifiedDoc: body.verifiedDoc,
          verifiedQt: body.verifiedQt,
          username: body.username,
          email: isEmail,
        };
      } else {
        const msg = header?.message || 'Failed to check KYC status';
        console.error('[KYC Check API] Unsuccessful Code/Header:', header);
        set({ error: msg, loading: false });
        return null;
      }
    } catch (err) {
      console.error('[KYC Check API] Exception Error:', err?.response?.data || err.message);
      const msg = err?.response?.data?.header?.message || err?.response?.data?.message || err.message || 'Failed to check KYC status';
      set({ error: msg, loading: false });
      return null;
    }
  },
}));
