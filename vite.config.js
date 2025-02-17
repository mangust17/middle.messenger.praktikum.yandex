import { defineConfig } from "vite";
import { webcrypto } from 'node:crypto';

export default defineConfig({
  root:'.',
  server: {
    port: 3000, 
  },
  preview: {
    port: 3000, 
  },
  assetsInclude: ["**/*.hbs"],
});

globalThis.crypto = webcrypto;
