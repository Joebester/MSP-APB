import { create } from 'zustand';
import { aesDecrypt, aesEncrypt } from "../utils/crypto"
import api from "../utils/API"
import { Trans, useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import i18n from '../utils/i18n';

const API_URL = import.meta.env.VITE_API_URL;
const DEFUALT_API_URL = import.meta.env.VITE_DEFUALT_API_URL;

export const useVerifyStore = create((set) => ({
  sending: false,
  sendError: null,
  sendSuccess: false,
  countdown: 0,

  verifying: false,
  verifyError: null,

  sendOtp: async (tel) => {
    set({ sending: true, sendError: null, sendSuccess: false });
    try {
      const message = i18n.t('Sending OTP to ' + tel);
      toast.success(message)
      let newTel = await aesEncrypt(tel)
      const response = await api.get(`otp/${newTel}`, {
        headers: {
          langCode: 'la',
        },
      });
      console.log(response)
      if (response.data?.code === "0000") {
        
      } else {
        toast.error(response.data?.message)
      }




      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     langCode: 'la',
      //   },
      //   body: null,
      // });
      // if (!response.ok) throw new Error(`Request failed (${response.status})`);

      // const data = await response.json();
      // const raw = data?.data;
      // console.log(raw)

      // set({ sendSuccess: true, countdown: 20 });
      // const timer = setInterval(() => {
      //   const { countdown } = useVerifyStore.getState();
      //   if (countdown <= 1) {
      //     clearInterval(timer);
      //     useVerifyStore.setState({ countdown: 0 });
      //   } else {
      //     useVerifyStore.setState({ countdown: countdown - 1 });
      //   }
      // }, 1000);


    } catch (err) {
      set({ sendError: err.message });
    } finally {
      set({ sending: false });
    }
  },

  verifyOtp: async (username, otpCode) => {
    set({ verifying: true, verifyError: null });
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          langCode: 'en',
        },
        body: JSON.stringify({
          timestamp,
          data: { username, otpCode },
        }),
      });
      if (!response.ok) throw new Error(`OTP verification failed (${response.status})`);
      return true;
    } catch (err) {
      set({ verifyError: err.message });
      return false;
    } finally {
      set({ verifying: false });
    }
  },

  resetSend: () => set({ sending: false, sendError: null, sendSuccess: false }),
}));
