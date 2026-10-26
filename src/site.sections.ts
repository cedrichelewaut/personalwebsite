export type SectionFlags = {
  intro: boolean;
  work: boolean;
  study: boolean;
  projects: boolean;
  photos: boolean;
  contact: boolean;
  bookshelf: boolean;
  blog: boolean;
};

export type SectionKey = keyof SectionFlags;

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
    href: "/#work",
    routes: [{ pattern: "/work/[slug]", entry: "./src/sections/work/[slug].astro" }],
  },
  study: {
    id: "study",
    label: "Education",
    href: "/#study",
    routes: [{ pattern: "/study/[slug]", entry: "./src/sections/study/[slug].astro" }],
  },
  projects: {
    id: "projects",
    label: "Projects",
    href: "/#projects",
    routes: [{ pattern: "/projects/[slug]", entry: "./src/sections/projects/[slug].astro" }],
  },
  photos: {
    id: "photography",
    label: "Photography",
    href: "/#photography",
    routes: [{ pattern: "/photography/[slug]", entry: "./src/sections/photography/[slug].astro" }],
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
  contact: {
    id: "contact",
    label: "Contact",
    href: "/#contact",
  },
  blog: {
    id: "blog",
    label: "Blog",
    href: "/#blog",
    routes: [{ pattern: "/blog/[slug]", entry: "./src/sections/blog/[slug].astro" }],
  },
};

export const experienceKeys = ["work", "study"] as const satisfies readonly SectionKey[];
export const personalKeys = ["projects", "photos", "bookshelf", "blog"] as const satisfies readonly SectionKey[];

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
  for (const key of Object.keys(sections) as SectionKey[]) {
    if (!sections[key]) continue;
    const meta = sectionMeta[key];
    if (meta.routes) routes.push(...meta.routes);
  }
  return routes;
}
