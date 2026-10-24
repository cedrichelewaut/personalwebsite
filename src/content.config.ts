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
  loader: glob({ pattern: "**/*.md", base: "./src/content/reading", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    read: readOn.default(""),
    summary: z.string().default(""),
    noteDate,
    draft: z.boolean().default(false),
  }),
});

/** One file, one book. Edit src/content/current.md to change what is being read. */
const current = defineCollection({
  loader: glob({ pattern: "current.md", base: "./src/content", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    edition: z.string(),
    url: z.string().url(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/collections", generateId: fileId }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().default(""),
      code: z.string().regex(collectionCode, "A collection code looks like F_02, CV_01, or W_014."),
      section: z.enum(["work", "projects", "photographs", "reading"]),
      photos: z.array(z.string()).optional(),
      order: z.number().default(0),
      noteDate,
      draft: z.boolean().default(false),
    })
    .refine((entry) => entry.section === "photographs" || !entry.photos?.length, {
      message: "Only a photograph collection lists plates.",
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing", generateId: fileId }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().default(""),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    order: z.number(),
    stub: z.boolean().default(false),
    photos: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, projects, reading, current, writing, series };
