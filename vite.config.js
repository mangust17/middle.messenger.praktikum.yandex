import { defineConfig } from "vite";
import crypto from 'node:crypto';

global.crypto = crypto;

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
