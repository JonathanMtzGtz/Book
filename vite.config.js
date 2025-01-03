import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Directorio raíz (ya dentro de src)
  publicDir: 'src/public',

  build: {
    outDir: '../dist', // Directorio de salida, fuera de "src"
    rollupOptions: {
      input: {
        main: 'src/index.html', // Ruta absoluta desde el directorio raíz del proyecto
        omoda: 'src/omoda.html',
        contacto: 'src/contacto.html',
        portafolio: 'src/portafolio.html',
      },
    },
  },
  optimizeDeps: {
    include: ['three'] // Asegúrate de incluir dependencias necesarias
  },
});
