import { create } from 'zustand';
import { aesDecrypt, aesEncrypt } from "../utils/crypto"
import api from "../utils/API"
import toast from 'react-hot-toast';
import i18n from '../utils/i18n';

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
      toast.success(message);
      const newTel = aesEncrypt(tel);
      const response = await api.get(`otp/${newTel}`, {
        headers: {
          langCode: localStorage.getItem('lang') || 'la',
        },
      });
      console.log('sendOtp response:', response.data);

      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        toast.success(response.data?.message || 'OTP sent successfully');
      } else {
        toast.error(response.data?.message || 'Failed to send OTP');
      }

      set({ sendSuccess: true, countdown: 20 });
      const timer = setInterval(() => {
        const { countdown } = useVerifyStore.getState();
        if (countdown <= 1) {
          clearInterval(timer);
          useVerifyStore.setState({ countdown: 0 });
        } else {
          useVerifyStore.setState({ countdown: countdown - 1 });
        }
      }, 1000);

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
      const bodyData = {
        timestamp,
        data: { username, otpCode },
      };
      const bodyJson = JSON.stringify(bodyData);
      const signature = aesEncrypt(bodyJson);

      const response = await api.post('/otp/verify', bodyData, {
        headers: {
          langCode: localStorage.getItem('lang') || 'la',
          'X-MSP-DATA-Signature': signature,
        },
      });
      console.log('verifyOtp response:', response.data);

      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        return response.data?.data || true;
      } else {
        set({ verifyError: response.data?.message || 'OTP verification failed' });
        toast.error(response.data?.message || 'OTP verification failed');
        return false;
      }
    } catch (err) {
      set({ verifyError: err.message });
      toast.error(err.message || 'OTP verification failed');
      return false;
    } finally {
      set({ verifying: false });
    }
  },

  resetSend: () => set({ sending: false, sendError: null, sendSuccess: false }),

  /* sendEmailOtp */
  sendEmailOtp: async (email) => {
    set({ sending: true, sendError: null, sendSuccess: false });

    try {
      toast.success(`Sending OTP to ${email}`);

      const encryptedEmail = aesEncrypt(email);

      const response = await api.post(
        "/email/request",
        {
          email: encryptedEmail,
        },
        {
          headers: {
            langCode: localStorage.getItem("lang") || "la",
          },
        }
      );

      console.log("sendEmailOtp response:", response.data);

      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === "true") {
        toast.success(response.data?.message || 'OTP sent successfully');

        set({
          sendSuccess: true,
          countdown: 20,
        });

        const timer = setInterval(() => {
          const { countdown } = useVerifyStore.getState();

          if (countdown <= 1) {
            clearInterval(timer);
            useVerifyStore.setState({ countdown: 0 });
          } else {
            useVerifyStore.setState({
              countdown: countdown - 1,
            });
          }
        }, 1000);
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("sendEmailOtp error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send OTP";

      toast.error(errorMessage);

      set({
        sendError: errorMessage,
      });
    } finally {
      set({ sending: false });
    }
  },


  /* verifyEmailOtp */
  verifyEmailOtp: async (email, otp) => {
    set({ verifying: true, verifyError: null });

    try {
      const encryptedEmail = aesEncrypt(email);

      const response = await api.post(
        "/email/verify",
        {
          email: encryptedEmail,
          otp: otp,
        },
        {
          headers: {
            langCode: localStorage.getItem("lang") || "la",
          },
        }
      );

      console.log("verifyEmailOtp response:", response.data);

      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === "true") {
        toast.success(response.data?.message || "OTP verified successfully");

        set({
          verifySuccess: true,
        });

        return response.data?.data || true;
      } else {
        toast.error(response.data?.message || "Invalid OTP");
        return false;
      }
    } catch (err) {
      console.error("verifyEmailOtp error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "OTP verification failed";

      toast.error(errorMessage);

      set({
        verifyError: errorMessage,
      });

      return false;
    } finally {
      set({
        verifying: false,
      });
    }
  },

}));
