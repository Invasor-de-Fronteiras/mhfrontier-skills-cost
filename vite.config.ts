import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import i18nResources from "vite-plugin-i18n-resources";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mhfrontier-skills-cost/',
  plugins: [react(),
    i18nResources({
      path: resolve(__dirname, "./src/locales"),
    })]
})
