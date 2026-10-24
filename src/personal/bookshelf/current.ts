import { getCollection } from "astro:content";

/** The Reading page shows one book in progress, edited in src/personal/bookshelf/content/current.md. */
export async function loadCurrent() {
  const entries = await getCollection("current");
  if (entries.length !== 1) {
    throw new Error(
      `src/personal/bookshelf/content/current.md must be the single book currently being read (found ${entries.length}).`,
    );
  }
  return entries[0];
}
