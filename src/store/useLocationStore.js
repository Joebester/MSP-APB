import { create } from 'zustand';
import api from '../utils/API';

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
      const response = await api.get('/provinces');
      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        const data = response.data.data;
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
      const response = await api.get(`/cities/${pvISO2Code}`);
      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        const data = response.data.data;
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
      const response = await api.get('/prefixes');
      if (response.data?.code === 200 || response.data?.success === true || response.data?.success === 'true') {
        const data = response.data.data;
        const list = Array.isArray(data) ? data : (data?.list || data?.items || data?.content || []);
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
