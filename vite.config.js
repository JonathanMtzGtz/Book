import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({

  base: './', 

  publicDir: 'public',
  
  server: {
    port: 5173,
    host: true,
    cors: true,
    strictPort: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    fs: {
      strict: false,
      allow: ['..', path.resolve(__dirname, 'public')]
    }
  },
  
  build: {
    outDir: 'dist',
  
    assetsDir: 'assets',
    assetsInlineLimit: 4096, 
    
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        contacto: path.resolve(__dirname, 'contacto.html'),
        portafolio: path.resolve(__dirname, 'portafolio.html'),
        omoda: path.resolve(__dirname, 'omoda.html'),
      },
      output: {
        // ⚠️ IMPORTANTE: Esto organiza mejor los chunks
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/mp4|webm|ogg/i.test(extType)) {
            extType = 'video';
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
  }
});