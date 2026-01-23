import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: 'public',
  
  server: {
    port: 5173,
    host: true,
    cors: true,
    strictPort: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    fs: {
      strict: false,
      allow: ['..', path.resolve(__dirname, 'public')]
    },
    
    // ⚠️ IMPORTANTE: Manejo de rutas SPA para evitar que JSON apunte a HTML
    proxy: {
      // Esto ayuda si tienes rutas dinámicas
      // '/api': 'http://localhost:3000'
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    
    // Agrega esto para copiar archivos estáticos correctamente
    copyPublicDir: true,
    
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        contacto: path.resolve(__dirname, 'contacto.html'),
        portafolio: path.resolve(__dirname, 'portafolio.html'),
        omoda: path.resolve(__dirname, 'omoda.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/mp4|webm|ogg/i.test(extType)) {
            extType = 'video';
          } else if (/json|gltf|glb|bin/i.test(extType)) {  // ← Añade modelos/3D
            extType = '3d';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  },

  optimizeDeps: {
    include: ['three']
  },
  
  // ⚠️ IMPORTANTE: Resolución de rutas para archivos estáticos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@public': path.resolve(__dirname, './public')  // ← Alias para public
    }
  }
});