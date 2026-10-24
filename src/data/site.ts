export const site = {
  name: "Cedric Helewaut",
  description: "Ghent-based Computer Engineer",
  url: "https://cedrichelewaut.be",
  email: "cedrichelewaut18@gmail.com",
  location: "Ghent",
  formspree: "https://formspree.io/f/xzbngqdy",
  profiles: [
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
} as const;

export const nav = [
  { href: "/", id: "index", num: "00", label: "index" },
  { href: "/work/", id: "work", num: "01", label: "work" },
  { href: "/projects/", id: "projects", num: "02", label: "projects" },
  { href: "/photographs/", id: "photographs", num: "03", label: "photographs" },
  { href: "/reading/", id: "reading", num: "04", label: "reading" },
  { href: "/contact/", id: "contact", num: "05", label: "contact" },
] as const;
