import { create } from 'zustand';
import { aesDecrypt, aesEncrypt } from '../utils/crypto';
import api from '../utils/API';
import toast from 'react-hot-toast';
import i18n from '../utils/i18n';

// shared countdown helper — avoids duplicated timer logic and leaked intervals
const startCountdown = (seconds = 20) => {
  useVerifyStore.setState({ countdown: seconds });
  const timer = setInterval(() => {
    const { countdown } = useVerifyStore.getState();
    if (countdown <= 1) {
      clearInterval(timer);
      useVerifyStore.setState({ countdown: 0 });
    } else {
      useVerifyStore.setState({ countdown: countdown - 1 });
    }
  }, 1000);
};

export const useVerifyStore = create((set) => ({
  sending: false,
  sendError: null,
  sendSuccess: false,
  countdown: 0,
  verifying: false,
  verifyError: null,
  message: null,
  otpBtnActive: false,
  emailBtnActive: false,
  verifySuccess: false,

  sendOtp: async (tel) => {
    set({ sending: true, sendError: null, sendSuccess: false });
    try {
      // interpolate with i18n properly instead of concatenating into the key
      toast.success(i18n.t('Sending OTP to') + ' ' + tel);
      const newTel = aesEncrypt(tel);
      const response = await api.get(`otp/${newTel}`, {
        headers: { langCode: localStorage.getItem('lang') || 'la' },
      });

      if (response.status === 200 && response.data?.success === true) {
        toast.success(response.data?.message || 'OTP sent successfully');
        set({ sendSuccess: true, otpBtnActive: true });
      } else {
        toast.error(response.data?.message || 'Failed to send OTP');
        set({
          sendSuccess: false,
          sendError: true,
          message: response.data?.message,
          otpBtnActive: false,
        });
      }
      startCountdown(20);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
      set({ sendError: err.message });
    } finally {
      set({ sending: false });
    }
  },

  verifyOtp: async (username, otpCode) => {
    set({ verifying: true, verifyError: null });
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const bodyData = { timestamp, data: { username, otpCode } };
      const signature = aesEncrypt(JSON.stringify(bodyData));

      const response = await api.post('/otp/verify', bodyData, {
        headers: {
          langCode: localStorage.getItem('lang') || 'la',
          'X-MSP-DATA-Signature': signature,
        },
      });

      const ok =
        response.data?.code === 200 ||
        response.data?.success === true ||
        response.data?.success === 'true';

      if (ok) {
        const profile = response.data?.data;
        let decryptedData = null;
        if (profile && typeof profile === 'string' && profile.includes(':')) {
          const decrypted = aesDecrypt(profile);
          decryptedData = JSON.parse(decrypted);
        } else if (profile && typeof profile === 'object') {
          decryptedData = profile;
        }

        if (decryptedData) {
          let u_profile = aesEncrypt(JSON.stringify(decryptedData?.profileId || decryptedData));
          localStorage.setItem('register_profile', JSON.stringify(u_profile ?? {}));
        }
        set({ verifySuccess: true });
        return profile || true; // component navigates on truthy return
      } else {
        const msg = response.data?.message || 'OTP verification failed';
        set({ verifyError: msg, verifySuccess: false });
        toast.error(msg);
        return false;
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'OTP verification failed';
      set({ verifyError: msg });
      toast.error(msg);
      return false;
    } finally {
      set({ verifying: false });
    }
  },

  resetSend: () => set({ sending: false, sendError: null, sendSuccess: false }),

  sendEmailOtp: async (email) => {
    set({ sending: true, sendError: null, sendSuccess: false });
    try {
      toast.success(`Sending OTP to ${email}`);
      const emailBody = {
        email,
        lang: localStorage.getItem('lang') || 'la',
      };
      const emailBodyEncrypt = aesEncrypt(JSON.stringify(emailBody));
      const response = await api.post('/email/request', emailBody, {
        headers: { 'X-MSP-DATA-Signature': emailBodyEncrypt },
      });

      const headerCode = response.data?.header?.code;
      const ok = response.status === 200 && (
        headerCode === '0000' ||
        headerCode === '00' ||
        response.data?.code === 200 ||
        response.data?.success === true
      );

      if (ok) {
        set({ sendSuccess: true, emailBtnActive: true });
        toast.success(response.data?.header?.message || response.data?.message || 'OTP sent successfully');
      } else {
        set({ sendSuccess: false, emailBtnActive: false });
        toast.error(response.data?.header?.message || response.data?.message || 'Failed to send OTP');
      }
      startCountdown(20);
    } catch (err) {
      console.error('sendEmailOtp error:', err);
      const errorMessage =
        err.response?.data?.header?.message ||
        err.response?.data?.message ||
        err.message ||
        'Failed to send OTP. Please check the network';
      toast.error(errorMessage);
      set({ sendError: errorMessage });
    } finally {
      set({ sending: false });
    }
  },

  verifyEmailOtp: async (email, otp) => {
    set({ verifying: true, verifyError: null });
    try {
      const otpEmailBody = { email, otp };
      const otpEmailBodyEncrypt = aesEncrypt(JSON.stringify(otpEmailBody));

      const response = await api.post('/email/verify', otpEmailBody, {
        headers: { 'X-MSP-DATA-Signature': otpEmailBodyEncrypt },
      });

      const headerCode = response.data?.header?.code;
      const ok = response.status === 200 && (
        headerCode === '0000' ||
        headerCode === '00' ||
        response.data?.code === 200
      );

      if (ok) {
        set({ verifySuccess: true });
        const body = response.data?.body;
        console.log(body?.profileId);
        if (body?.profileId) {
          let u_profile = aesEncrypt(JSON.stringify(body.profileId));
          localStorage.setItem('register_profile', JSON.stringify(u_profile ?? {}));
        }
        toast.success(response.data?.header?.message || response.data?.message || 'OTP verified successfully');
        return body || true; // component navigates
      } else {
        set({ verifySuccess: false });
        toast.error(response.data?.header?.message || response.data?.message || 'OTP verification failed');
        return false;
      }
    } catch (err) {
      console.error('verifyEmailOtp error:', err);
      const errorMessage =
        err.response?.data?.header?.message ||
        err.response?.data?.message ||
        err.message ||
        'OTP verification failed';
      toast.error(errorMessage);
      set({ verifyError: errorMessage });
      return false;
    } finally {
      set({ verifying: false });
    }
  },
}));