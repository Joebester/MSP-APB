import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  // base: command === 'build' ? '/msp-register/' : '/',
  base: '/msp-register/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '10.2.6.177',
    port: 1234,
    proxy: {
      '/api': {
        target: 'http://localhost:7777',
        changeOrigin: true,
      },
    },
  },
}));