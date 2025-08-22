import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: './dist',  // Builds to root /dist
    emptyOutDir: true,
  },
  publicDir: './public'  // Your existing public dir
});