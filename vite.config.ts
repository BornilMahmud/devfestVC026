import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist', 'pdf-lib', 'three', '@react-three/fiber', '@react-three/drei']
  },
  server: {
    port: 3000,
    open: true
  }
});
