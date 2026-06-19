import { create } from 'zustand';
import { aesDecrypt } from '../utils/crypto';

export const usePolicyStore = create((set, get) => ({
  condition: null,
  info: null,
  loading: false,
  error: null,
  agreed: false,

  setAgreed: (value) => set({ agreed: value }),

  fetchPolicy: async () => {
    if (get().condition) return;
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/policy`, {
        headers: {
          langCode: localStorage.getItem("lang"),
          // 'X-MSP-DATA-Signature': import.meta.env.VITE_MSP_DATA_SIGNATURE,
        },
      });
      if (!response.ok) throw new Error(`Failed to load policy (${response.status})`);
      const data = await response.json();
  
      const raw = data?.data;
      console.log(raw)
      const decrypted = await aesDecrypt(raw);
      const parsed = JSON.parse(decrypted);
      set({
        condition: parsed.condition ?? null,
        info: parsed.info ?? null,
      });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
