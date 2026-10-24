import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://cedrichelewaut.be",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
