import { create } from 'zustand';
import { aesDecrypt } from '../utils/crypto';
import api from '../utils/API';

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
      const response = await api.get('policy');
      const data = response.data;

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
