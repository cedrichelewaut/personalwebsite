import type { SectionFlags } from "./site.sections";

/**
 * Template config. Edit this file.
 * `bookshelf` ships off. This repo's netlify.toml sets PERSONAL_BOOKSHELF=true
 * so Cedric's production build turns it on. Cloners delete that line.
 */
export const siteConfig = {
  name: "Cedric Helewaut",
  tagline: "Ghent-based Computer Engineer",
  url: "https://cedrichelewaut.be",
  email: "cedrichelewaut18@gmail.com",
  location: "Ghent",
  formspree: "https://formspree.io/f/xzbngqdy",
  ogImage: "/img/cedric-portrait.jpg",
  intro:
    "Cedric Helewaut is a Ghent-based computer science engineer passionate about product management and go-to-market.",
  contactLink: { href: "/#contact", label: "Get in touch →" },
  /** The full marathon schedule lives outside this site. */
  runningBoard: "https://cedrichelewaut.github.io/marathoning/",
  runningRepo: "https://github.com/cedrichelewaut/marathoning",
  portrait: {
    src: "/img/cedric-portrait.jpg",
    alt: "Portrait of Cedric Helewaut",
    width: 800,
    height: 1200,
  },
  socials: [
    {
      label: "Email",
      display: "cedrichelewaut18@gmail.com",
      href: "mailto:cedrichelewaut18@gmail.com",
    },
    {
      label: "LinkedIn",
      display: "linkedin.com/in/cedrichelewaut",
      href: "https://www.linkedin.com/in/cedrichelewaut",
    },
    {
      label: "GitHub",
      display: "github.com/cedrichelewaut",
      href: "https://github.com/cedrichelewaut",
    },
    {
      label: "Instagram",
      display: "instagram.com/cedrichelewaut",
      href: "https://instagram.com/cedrichelewaut",
    },
  ],
  sections: {
    intro: true,
    work: true,
    study: true,
    projects: true,
    photos: true,
    contact: true,
    running: true,
    bookshelf: false,
    blog: false,
  } satisfies SectionFlags,
};
