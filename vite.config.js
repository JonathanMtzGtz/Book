import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Directorio raíz (ya dentro de src)
  publicDir: 'src/public',

  build: {
    outDir: '../dist', // Directorio de salida, fuera de "src"
    rollupOptions: {
      input: {
        main: 'index.html',
        contacto: 'contacto.html',
        portafolio: 'portafolio.html',
      },
    },
  },
  optimizeDeps: {
    include: ['three'] // Asegúrate de incluir dependencias necesarias
  },
});
