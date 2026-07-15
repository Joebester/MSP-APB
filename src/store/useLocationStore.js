import { create } from 'zustand';
import api from '../utils/API';
import api_defualt from '../utils/API_Defualt'

export const useLocationStore = create((set, get) => ({
  provinces: [],
  cities: [],
  prefixes: [],
  loadingProvinces: false,
  loadingCities: false,
  loadingPrefixes: false,
  error: null,

  fetchProvinces: async () => {
    if (get().provinces.length > 0) return;
    set({ loadingProvinces: true, error: null });
    try {
      const response = await api_defualt.get('address/state');
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
      const response = await api_defualt.get(`address/city?stateCode=${pvISO2Code}`);
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
      const response = await api.get('/prefixes', {
        headers: {
          langCode: localStorage.getItem('lang') === "la" ? 'LO': 'EN'
        },
      });
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
}));
