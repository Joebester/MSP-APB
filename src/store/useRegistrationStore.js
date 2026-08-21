import { create } from 'zustand';
import api from '../utils/API';
import { aesEncrypt, aesDecrypt } from '../utils/crypto';
import toast from 'react-hot-toast';

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

export const useRegistrationStore = create((set) => ({
  submitting: false,
  confirming: false,
  error: null,

  submitInfo: async (data) => {
    set({ submitting: true, error: null });
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const bodyData = {
        timestamp,
        channel: "MSP-WEBVIEW",
        data: data,
      };
      const bodyJson = JSON.stringify(bodyData);
      const signature = aesEncrypt(bodyJson);

      const response = await api.post('/info', bodyData, {
        headers: {
          'X-MSP-DATA-Signature': signature,
        },
      });

      if (response.status === 200) {
        if (response.data?.code === 200 && response.data?.success) {
          toast.success(response.data?.message);
          return true
        } else {
          toast.error(response.data?.message);
          return false
        }
        console.log(response.data)
        // toast.success(response.data?.header?.message || 'Failed to send OTP');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to submit info');
      }
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ submitting: false });
    }
  },

  confirmRegistration: async (profileId) => {
    set({ confirming: true, error: null });
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const bodyData = {
        timestamp,
        channel: "MSP-WEBVIEW",
        data: { profileId, sendinfo: true, acceptcondition: true },
      };
      const bodyJson = JSON.stringify(bodyData);
      const signature = aesEncrypt(bodyJson);

      const response = await api.post('/confirm', bodyData, {
        headers: {
          'X-MSP-DATA-Signature': signature,
        },
      });

      const code = response.data?.code;
      const ok = response.status === 200 && (code === '0000' || code === '00' || code === 200 || code === '200');

      if (ok) {
        const token = response.data?.data?.accessToken;
        if (token) {
          localStorage.setItem('access_token', token);
        }
        toast.success(response.data?.message || 'Registration confirmed successfully');
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to confirm registration');
        return false;
      }
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ confirming: false });
    }
  },

  submitQuestions: async (answers) => {
    try {
      const payload = answers.map((answer, index) => ({
        questionId: index + 1,
        answer: aesEncrypt(answer),
      }));

      const response = await api.put(getGatewayUrl('/api/v1/msp/question/newQuestion'), payload, {
        baseURL: '',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const code = response.data?.code;
      const ok = response.status === 200 && (code === '0000' || code === '00' || code === 200 || code === '200');

      if (ok) {
        toast.success(response.data?.message || 'Questions saved');
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to save questions');
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to save questions');
      return false;
    }
  },

  uploadDocument: async (docFile, typeId, rfDocNo, exp, pageType) => {
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const formData = new FormData();
      const docInfo = JSON.stringify({
        typeId,
        rfDocNo,
        exp,
        pageType,
        timestamp,
      });
      formData.append('docInfo', docInfo);
      formData.append('docFile', docFile);

      const response = await api.post(getGatewayUrl('/api/v1/msp/signup/auth/doc/info'), formData, {
        baseURL: '',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const code = response.data?.code;
      const ok = response.status === 200 && (code === '0000' || code === '00' || code === 200 || code === '200');

      if (ok) {
        toast.success(`${pageType} uploaded successfully`);
        return true;
      } else {
        toast.error(response.data?.message || `Failed to upload ${pageType}`);
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || `Failed to upload ${pageType}`);
      return false;
    }
  },

  submitKyc: async () => {
    try {
      const response = await api.post(getGatewayUrl('/api/v1/msp/signup/auth/doc/submit'), {}, {
        baseURL: '',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const code = response.data?.code;
      const ok = response.status === 200 && (code === '0000' || code === '00' || code === 200 || code === '200');

      if (ok) {
        toast.success(response.data?.message || 'Pending review');
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to submit KYC review');
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to submit KYC review');
      return false;
    }
  },

  verifyMepom: async (mepomId) => {
    try {
      const bodyData = {
        usernameId: mepomId,
        authen: true,
      };
      const signature = aesEncrypt(JSON.stringify(bodyData));

      const response = await api.post(getGatewayUrl('/api/v1/msp/signup/auth/mepom/verify'), bodyData, {
        baseURL: '',
        headers: {
          'X-MSP-DATA-Signature': signature,
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const code = response.data?.code;
      const ok = response.status === 200 && (code === '0000' || code === '00' || code === 200 || code === '200');

      if (ok) {
        toast.success(response.data?.message || 'Verification successful');
        return true;
      } else {
        toast.error(response.data?.message || 'Verification failed');
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Verification failed');
      return false;
    }
  },

  fetchCustomerInfo: async (tel) => {
    try {
      const encryptedTel = aesEncrypt(tel);
      const response = await api.get(`/info/${encryptedTel}`);

      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        const raw = response.data?.data;
        if (raw) {
          const decrypted = await aesDecrypt(raw);
          return JSON.parse(decrypted);
        }
        return null;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch customer info');
      }
    } catch (err) {
      console.error('Failed to fetch customer info:', err);
      throw err;
    }
  },
}));
