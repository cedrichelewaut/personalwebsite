import { siteConfig } from "./site.config";
import type { SectionFlags } from "./site.sections";

declare const __SITE_SECTIONS__: SectionFlags;

export const sections: SectionFlags = __SITE_SECTIONS__;

export const site = {
  name: siteConfig.name,
  description: siteConfig.tagline,
  url: siteConfig.url,
  email: siteConfig.email,
  location: siteConfig.location,
  formspree: siteConfig.formspree,
  ogImage: siteConfig.ogImage,
  intro: siteConfig.intro,
  contactLink: siteConfig.contactLink,
  runningBoard: siteConfig.runningBoard,
  portrait: siteConfig.portrait,
  profiles: siteConfig.socials,
  sections,
};
