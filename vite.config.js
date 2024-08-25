import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Gunakan 0.0.0.0 untuk mengizinkan akses dari semua alamat IP
      port: 5173, // Port default Vite
    },
    define: {
      'process.env': env
    }
  };
});