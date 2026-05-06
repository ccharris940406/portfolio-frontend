// @ts-check
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      PUBLIC_AI_API_URL: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
});