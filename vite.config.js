import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  // base: command === 'build' ? '/msp-register/' : '/',
  base: '/msp-register/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '10.2.6.179',
    port: 1234,
    proxy: {
      '/api': {
        target: 'http://uat-sv.mobile.apb.com.local', // UAT Server
        // target: 'http://10.2.6.177:7777', // Local Server
        changeOrigin: true,
      },
    },
  },
}));