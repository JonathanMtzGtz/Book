import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        contacto: 'src/contacto.html',
        portafolio: 'src/portafolio.html',
      },
    },
  },
  optimizeDeps: {
    include: ['three']
  },
});