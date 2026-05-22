import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // base './' makes all asset paths relative - required for Live Server / file:// opening
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts':    path.resolve(__dirname, './src/layouts'),
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@utils':      path.resolve(__dirname, './src/utils'),
      '@data':       path.resolve(__dirname, './src/data'),
      '@styles':     path.resolve(__dirname, './src/styles'),
      '@assets':     path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
