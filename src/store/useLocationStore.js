import { create } from 'zustand';
import api from '../utils/API';

// Address lookups expect the raw lowercase code rather than the LO/EN mapping.
const rawLangHeaders = () => ({
  langCode: localStorage.getItem('lang') || 'la',
});

export const useLocationStore = create((set, get) => ({
  provinces: [],
  cities: [],
  villages: [],
  prefixes: [],
  loadingProvinces: false,
  loadingCities: false,
  loadingVillages: false,
  loadingPrefixes: false,
  error: null,

  fetchProvinces: async () => {
    if (get().provinces.length > 0) return;
    set({ loadingProvinces: true, error: null });
    try {
      const response = await api.get('address/state', { headers: rawLangHeaders() });
      if (response.data?.header?.code === "0000") {
        const data = response.data?.body;
        const list = Array.isArray(data) ? data : (data?.list || data?.items || data?.content || []);
        set({ provinces: list });
      } else {
        throw new Error(response.data?.message || 'Failed to fetch provinces');
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loadingProvinces: false });
    }
  },

  fetchCities: async (pvISO2Code) => {
    if (!pvISO2Code) {
      set({ cities: [] });
      return;
    }
    set({ loadingCities: true, error: null, cities: [] });
    try {
      const response = await api.get(`address/city?stateCode=${pvISO2Code}`, {
        headers: rawLangHeaders(),
      });
      if (response.data?.header?.code === "0000") {
        const data = response.data?.body;
        const list = Array.isArray(data) ? data : (data?.list || data?.items || data?.content || []);
        set({ cities: list });
      } else {
        throw new Error(response.data?.message || 'Failed to fetch cities');
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loadingCities: false });
    }
  },

  fetchPrefixes: async () => {
    if (get().prefixes.length > 0) return;
    set({ loadingPrefixes: true, error: null });
    try {
      const response = await api.get('public/prefixes');
      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        const data = response.data.data;
        const list = Array.isArray(data) ? data : (data?.prefixName || data?.prefixId || data?.prefixCode);
        set({ prefixes: list });
      } else {
        throw new Error(response.data?.message || 'Failed to fetch prefixes');
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loadingPrefixes: false });
    }
  },

  fetchVillages: async (cityId) => {
    if (!cityId) {
      set({ villages: [] });
      return;
    }
    set({ loadingVillages: true, error: null, villages: [] });
    try {
      const response = await api.get(`public/villages/${cityId}`);
      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        const data = response.data.data;
        const list = Array.isArray(data) ? data : (data?.list || data?.items || data?.content || []);
        set({ villages: list });
      } else {
        throw new Error(response.data?.message || 'Failed to fetch villages');
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loadingVillages: false });
    }
  },
}));
