import { defineConfig } from "astro/config";
import { siteConfig } from "./src/site.config";
import { resolveSections, routesFor } from "./src/site.sections";

const sections = resolveSections(siteConfig.sections, process.env);

export default defineConfig({
  site: siteConfig.url,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  vite: {
    define: {
      __SITE_SECTIONS__: JSON.stringify(sections),
    },
  },
  integrations: [
    {
      name: "optional-sections",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          for (const route of routesFor(sections)) {
            injectRoute({ pattern: route.pattern, entrypoint: route.entry, prerender: true });
          }
        },
      },
    },
  ],
});
