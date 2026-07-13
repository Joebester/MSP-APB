// import { create } from 'zustand';
// import api from '../utils/API';
// import { aesEncrypt, aesDecrypt } from '../utils/crypto';

// export const useRegistrationStore = create((set) => ({
//   submitting: false,
//   confirming: false,
//   error: null,

//   submitInfo: async (data) => {
//     set({ submitting: true, error: null });
//     try {
//       const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
//       const bodyData = {
//         timestamp,
//         channel: 'MOBILE',
//         data: data,
//       };
//       const bodyJson = JSON.stringify(bodyData);
//       const signature = aesEncrypt(bodyJson);

//       const response = await api.post('/info', bodyData, {
//         headers: {
//           'X-MSP-DATA-Signature': signature,
//         },
//       });

//       if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
//         return true;
//       } else {
//         throw new Error(response.data?.message || 'Failed to submit info');
//       }
//     } catch (err) {
//       set({ error: err.message });
//       return false;
//     } finally {
//       set({ submitting: false });
//     }
//   },

//   confirmRegistration: async (profileId) => {
//     set({ confirming: true, error: null });
//     try {
//       const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
//       const bodyData = {
//         timestamp,
//         data: { profileId, sendinfo: true, acceptcondition: true },
//       };
//       const bodyJson = JSON.stringify(bodyData);
//       const signature = aesEncrypt(bodyJson);

//       const response = await api.post('/confirm', bodyData, {
//         headers: {
//           'X-MSP-DATA-Signature': signature,
//         },
//       });

//       if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
//         return true;
//       } else {
//         throw new Error(response.data?.message || 'Failed to confirm registration');
//       }
//     } catch (err) {
//       set({ error: err.message });
//       return false;
//     } finally {
//       set({ confirming: false });
//     }
//   },

//   fetchCustomerInfo: async (tel) => {
//     try {
//       const encryptedTel = aesEncrypt(tel);
//       const response = await api.get(`/info/${encryptedTel}`);

//       if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
//         const raw = response.data?.data;
//         if (raw) {
//           const decrypted = await aesDecrypt(raw);
//           return JSON.parse(decrypted);
//         }
//         return null;
//       } else {
//         throw new Error(response.data?.message || 'Failed to fetch customer info');
//       }
//     } catch (err) {
//       console.error('Failed to fetch customer info:', err);
//       throw err;
//     }
//   },
// }));

import { create } from 'zustand';
import api from '../utils/API';
import { aesEncrypt, aesDecrypt } from '../utils/crypto';

// backend ส่ง code แบบ string "0000" เป็นหลัก แต่บาง endpoint อาจส่งแบบอื่น
// เลยเช็คให้ครอบคลุมทุกแบบที่เจอในโค้ดเดิม + ที่ guideline ระบุ
function isSuccess(resData) {
  const code = resData?.code ?? resData?.header?.code;
  return (
    code === '0000' ||
    code === '00' ||
    code === 200 ||
    resData?.success === true ||
    resData?.success === 'true'
  );
}

export const useRegistrationStore = create((set) => ({
  submitting: false,
  confirming: false,
  submittingQuestions: false,
  verifyingMepom: false,
  uploadingDoc: false,
  submittingDocs: false,
  error: null,
  mepomError: null,

  // ---------- Step 3: Submit Personal Info ----------
  submitInfo: async (data) => {
    set({ submitting: true, error: null });
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const bodyData = {
        timestamp,
        channel: 'MOBILE',
        data: data,
      };
      const bodyJson = JSON.stringify(bodyData);
      const signature = aesEncrypt(bodyJson);

      const response = await api.post('/info', bodyData, {
        headers: {
          'X-MSP-DATA-Signature': signature,
        },
      });

      if (isSuccess(response.data)) {
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to submit info');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      return false;
    } finally {
      set({ submitting: false });
    }
  },

  // ---------- Step 4: Confirm & Commit Registration ----------
  // ⚠️ เดิม endpoint ไม่เคยถูกเรียกจากหน้า UI เลย ต้องเรียกต่อจาก submitInfo เสมอ
  confirmRegistration: async (profileId) => {
    set({ confirming: true, error: null });
    try {
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const bodyData = {
        timestamp,
        data: { profileId, sendinfo: true, acceptcondition: true },
      };
      const bodyJson = JSON.stringify(bodyData);
      const signature = aesEncrypt(bodyJson);

      const response = await api.post('/confirm', bodyData, {
        headers: {
          'X-MSP-DATA-Signature': signature,
        },
      });

      if (isSuccess(response.data)) {
        let payload = response.data?.data;
        // เผื่อ backend เข้ารหัส payload มาแบบ "IV:cipher" เหมือน endpoint อื่น
        if (payload && typeof payload === 'string' && payload.includes(':')) {
          payload = JSON.parse(aesDecrypt(payload));
        }
        const accessToken = payload?.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        return payload || true;
      } else {
        throw new Error(response.data?.message || 'Failed to confirm registration');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      return false;
    } finally {
      set({ confirming: false });
    }
  },

  fetchCustomerInfo: async (tel) => {
    try {
      const encryptedTel = aesEncrypt(tel);
      const response = await api.get(`/info/${encryptedTel}`);

      if (isSuccess(response.data)) {
        const raw = response.data?.data;
        if (raw) {
          const decrypted = aesDecrypt(raw);
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

  // ---------- Step 5: Security Questions ----------
  // ⚠️ สมมติว่า questionId ตรงกับลำดับ index+1 ของ SECURITY_QUESTIONS
  // ถ้า backend มี questionId เฉพาะที่ไม่ตรงกับลำดับ ต้อง map ใหม่ตรงนี้
  submitSecurityAnswers: async (answers) => {
    set({ submittingQuestions: true, error: null });
    try {
      const payload = answers.map((answer, idx) => ({
        questionId: idx + 1,
        answer: aesEncrypt(answer),
      }));
      const bodyJson = JSON.stringify(payload);
      const signature = aesEncrypt(bodyJson);

      const response = await api.put('/question/newQuestion', payload, {
        headers: {
          'X-MSP-DATA-Signature': signature,
        },
      });

      if (isSuccess(response.data)) {
        return true;
      }
      throw new Error(response.data?.message || 'Failed to save security questions');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      return false;
    } finally {
      set({ submittingQuestions: false });
    }
  },

  // ---------- KYC Pathway A: Document Upload ----------
  uploadDocument: async ({ typeId, rfDocNo, exp, pageType, file }) => {
    set({ uploadingDoc: true, error: null });
    try {
      const docInfo = JSON.stringify({ typeId, rfDocNo, exp, pageType });
      const formData = new FormData();
      formData.append('docInfo', docInfo);
      formData.append('docFile', file);

      const response = await api.post('/doc/info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (isSuccess(response.data)) {
        return true;
      }
      throw new Error(response.data?.message || 'Failed to upload document');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      return false;
    } finally {
      set({ uploadingDoc: false });
    }
  },

  submitDocuments: async () => {
    set({ submittingDocs: true, error: null });
    try {
      const response = await api.post('/doc/submit');
      if (isSuccess(response.data)) {
        return true;
      }
      throw new Error(response.data?.message || 'Failed to submit documents');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      return false;
    } finally {
      set({ submittingDocs: false });
    }
  },

  // ---------- KYC Pathway B: MEPOM Instant Verification ----------
  verifyMepom: async (usernameId) => {
    set({ verifyingMepom: true, mepomError: null });
    try {
      const bodyData = { usernameId, authen: true };
      const bodyJson = JSON.stringify(bodyData);
      const signature = aesEncrypt(bodyJson);

      const response = await api.post('/mepom/verify', bodyData, {
        headers: {
          'X-MSP-DATA-Signature': signature,
        },
      });

      if (isSuccess(response.data)) {
        return true;
      }
      set({ mepomError: response.data?.message || 'Verification failed' });
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ mepomError: msg });
      return false;
    } finally {
      set({ verifyingMepom: false });
    }
  },
}));