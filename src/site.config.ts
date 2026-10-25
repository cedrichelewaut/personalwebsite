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
  ogImage: "/img/cedric.jpg",
  intro:
    "I’m Cedric, a Ghent-based engineer passionate about building products and taking them to market. I love working on innovation, especially around security and sustainability.",
  contactLink: { href: "/#contact", label: "Get in touch →" },
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
    blog: false,
    contact: true,
    running: true,
    bookshelf: false,
  } satisfies SectionFlags,
};
