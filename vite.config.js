import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  assetsInclude: ["**/*.hbs"],
  build: {
    rollupOptions: {
      input: 'index.ts'
    }
  }
});
