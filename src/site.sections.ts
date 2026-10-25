export type SectionFlags = {
  intro: boolean;
  work: boolean;
  study: boolean;
  projects: boolean;
  photos: boolean;
  blog: boolean;
  contact: boolean;
  running: boolean;
  bookshelf: boolean;
};

export type SectionKey = keyof SectionFlags;

export interface NavItem {
  href: string;
  id: string;
  label: string;
}

export interface SectionRoute {
  pattern: string;
  entry: string;
}

interface SectionDef {
  id: string;
  label: string;
  href: string;
  routes?: SectionRoute[];
}

export const sectionMeta: Record<SectionKey, SectionDef> = {
  intro: { id: "intro", label: "Intro", href: "/" },
  work: {
    id: "work",
    label: "Work",
    href: "/work/",
    routes: [
      { pattern: "/work", entry: "./src/sections/work/index.astro" },
      { pattern: "/work/[slug]", entry: "./src/sections/work/[slug].astro" },
    ],
  },
  study: {
    id: "study",
    label: "Study",
    href: "/study/",
    routes: [
      { pattern: "/study", entry: "./src/sections/study/index.astro" },
      { pattern: "/study/[slug]", entry: "./src/sections/study/[slug].astro" },
    ],
  },
  projects: {
    id: "projects",
    label: "Projects",
    href: "/projects/",
    routes: [
      { pattern: "/projects", entry: "./src/sections/projects/index.astro" },
      { pattern: "/projects/[slug]", entry: "./src/sections/projects/[slug].astro" },
    ],
  },
  photos: {
    id: "photographs",
    label: "Photography",
    href: "/photographs/",
    routes: [
      { pattern: "/photographs", entry: "./src/sections/photographs/index.astro" },
      { pattern: "/photographs/[slug]", entry: "./src/sections/photographs/[slug].astro" },
    ],
  },
  bookshelf: {
    id: "reading",
    label: "Readings",
    href: "/reading/",
    routes: [
      { pattern: "/reading", entry: "./src/personal/bookshelf/pages/index.astro" },
      { pattern: "/reading/[slug]", entry: "./src/personal/bookshelf/pages/[slug].astro" },
    ],
  },
  running: {
    id: "running",
    label: "Running",
    href: "/running/",
    routes: [{ pattern: "/running", entry: "./src/sections/running/index.astro" }],
  },
  blog: {
    id: "blog",
    label: "Blog",
    href: "/blog/",
    routes: [
      { pattern: "/blog", entry: "./src/sections/blog/index.astro" },
      { pattern: "/blog/[slug]", entry: "./src/sections/blog/[slug].astro" },
    ],
  },
  contact: {
    id: "contact",
    label: "Contact",
    href: "/contact/",
    routes: [{ pattern: "/contact", entry: "./src/sections/contact/index.astro" }],
  },
};

export const experienceKeys = ["work", "study"] as const satisfies readonly SectionKey[];
export const personalKeys = ["projects", "photos", "bookshelf", "running", "blog"] as const satisfies readonly SectionKey[];

export function groupOn(sections: SectionFlags, keys: readonly SectionKey[]) {
  return keys.some((key) => sections[key]);
}

export function resolveSections(defaults: SectionFlags, env: NodeJS.ProcessEnv = process.env): SectionFlags {
  const sections: SectionFlags = { ...defaults };
  const bookshelf = env.PERSONAL_BOOKSHELF;
  if (bookshelf === "true" || bookshelf === "1") sections.bookshelf = true;
  else if (bookshelf === "false" || bookshelf === "0") sections.bookshelf = false;
  for (const part of (env.SECTIONS_ON ?? "").split(",")) {
    const key = part.trim();
    if (key in sections) sections[key as SectionKey] = true;
  }
  for (const part of (env.SECTIONS_OFF ?? "").split(",")) {
    const key = part.trim();
    if (key in sections) sections[key as SectionKey] = false;
  }
  return sections;
}

export function routesFor(sections: SectionFlags): SectionRoute[] {
  const routes: SectionRoute[] = [];
  if (groupOn(sections, experienceKeys)) {
    routes.push({ pattern: "/experience", entry: "./src/sections/experience/index.astro" });
  }
  if (groupOn(sections, personalKeys)) {
    routes.push({ pattern: "/personal-projects", entry: "./src/sections/personal/index.astro" });
  }
  for (const key of Object.keys(sections) as SectionKey[]) {
    if (!sections[key]) continue;
    const meta = sectionMeta[key];
    if (meta.routes) routes.push(...meta.routes);
  }
  return routes;
}

/** Four flat header items. Groups with every section off are omitted. */
export function navModel(sections: SectionFlags) {
  const navItems: NavItem[] = [{ href: "/", id: "home", label: "Home" }];
  if (groupOn(sections, experienceKeys)) {
    navItems.push({ href: "/experience/", id: "experience", label: "Experience" });
  }
  if (groupOn(sections, personalKeys)) {
    navItems.push({ href: "/personal-projects/", id: "personal", label: "Projects" });
  }
  if (sections.contact) {
    navItems.push({ href: "/contact/", id: "contact", label: "Contact" });
  }
  return { navItems };
}
