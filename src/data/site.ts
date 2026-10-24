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

export const navGroups = [
  {
    id: "experience",
    label: "Experience",
    items: [
      { href: "/work/", id: "work", label: "Work" },
      { href: "/study/", id: "study", label: "Study" },
    ],
  },
  {
    id: "personal",
    label: "Personal Projects",
    items: [
      { href: "/projects/", id: "projects", label: "Projects" },
      { href: "/photographs/", id: "photographs", label: "Photographs" },
      { href: "/reading/", id: "reading", label: "Reading" },
      { href: "/running/", id: "running", label: "Running" },
    ],
  },
] as const;

export const navContact = { href: "/contact/", id: "contact", label: "Contact" } as const;
