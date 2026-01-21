import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Configuración básica
  publicDir: 'public',
  
  server: {
    port: 5173,
    host: true,
    // Configuración específica para Windows
    cors: true,
    strictPort: false,
    
    // Headers simplificados
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    
    fs: {
      // Permitir acceso desde cualquier ubicación
      strict: false,
      allow: ['..', path.resolve(__dirname, 'public')]
    }
  },
  
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        contacto: path.resolve(__dirname, 'contacto.html'),
        portafolio: path.resolve(__dirname, 'portafolio.html'),
        omoda: path.resolve(__dirname, 'omoda.html'),
      }
    }
  },
  
  // Optimizaciones para Three.js
  optimizeDeps: {
    include: ['three']
  }
});