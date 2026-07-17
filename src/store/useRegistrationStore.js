import { create } from 'zustand';
import api from '../utils/API';
import { aesEncrypt, aesDecrypt } from '../utils/crypto';
import toast from 'react-hot-toast';

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

      if (response.status === 200) {
        if (response.data?.code === 200) {
          toast.success(response.data?.message)
          return true
        } else {
          toast.error(response.data?.message)
          return false
        }
      } else {
        toast.error(response.data?.message)
        throw new Error(response.data?.message || 'Failed to confirm registration');
      }
    } catch (err) {
      set({ error: err.message });
      return false;
    } finally {
      set({ confirming: false });
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