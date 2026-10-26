import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { collectionCode } from "./lib/slugs";

/** The filename, case preserved. Item slugs are lowercase; collection codes are a separate field. */
function fileId({ entry }: { entry: string }) {
  return entry.replace(/\.[^.]+$/, "");
}

const figure = z
  .object({
    src: z.string(),
    alt: z.string(),
    caption: z.string(),
  })
  .optional();

const noteDate = z.preprocess((value) => {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional());

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    indexTitle: z.string().optional(),
    subtitle: z.string().optional(),
    org: z.string(),
    start: z.string(),
    end: z.string(),
    summary: z.string(),
    order: z.number(),
    noteDate,
    figure,
    stub: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const study = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/study", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    org: z.string(),
    start: z.string(),
    end: z.string(),
    summary: z.string(),
    order: z.number(),
    /** Id of the study entry this one is listed under on the home page. */
    parent: z.string().optional(),
    noteDate,
    stub: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    year: z.string().default("—"),
    summary: z.string().default(""),
    url: z
      .string()
      .default("")
      .refine((value) => value === "" || z.string().url().safeParse(value).success, "Link must be a URL or empty."),
    order: z.number().default(0),
    noteDate,
    org: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    stub: z.boolean().default(false),
    /** A password-protected page. Its encrypted body lives in src/private/<slug>.json. */
    locked: z.boolean().default(false),
    /** Append the live running progress chart and a link to the full schedule. */
    embed: z.enum(["running"]).optional(),
    draft: z.boolean().default(false),
  }),
});

const readOn = z.preprocess((value) => {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (value == null) return "";
  return value;
}, z.string().regex(/^$|^\d{4}-\d{2}(-\d{2})?$/));

const reading = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/personal/bookshelf/content/reading", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    read: readOn.default(""),
    summary: z.string().default(""),
    /** Dutch books set nl. Omit for English. */
    lang: z.enum(["nl"]).optional(),
    /** Goodreads rating. Home recommendations are the three newest with rating above 4. */
    rating: z.number().min(0).max(5).optional(),
    noteDate,
    draft: z.boolean().default(false),
  }),
});

/** One file, one book. Edit src/personal/bookshelf/content/current.md to change what is being read. */
const current = defineCollection({
  loader: glob({ pattern: "current.md", base: "./src/personal/bookshelf/content", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    url: z.string().url(),
    /** Dutch books set nl. Omit for English. */
    lang: z.enum(["nl"]).optional(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/collections", generateId: fileId }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().default(""),
      code: z.string().regex(collectionCode, "A collection code looks like F_02, CV_01, or W_014."),
      section: z.enum(["work", "study", "projects", "reading"]),
      order: z.number().default(0),
      noteDate,
      draft: z.boolean().default(false),
    }),
});

const isoDate = z.preprocess((value) => {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    summary: z.string().default(""),
    noteDate,
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const photography = defineCollection({
  loader: glob({
    pattern: "**/index.md",
    base: "./src/content/photography",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, "").replaceAll("\\", "/"),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: isoDate,
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work, study, projects, reading, current, series, blog, photography };
