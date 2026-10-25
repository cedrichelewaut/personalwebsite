import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

const articleImages = import.meta.glob<ImageMetadata>(
  "../content/articles/**/*.{avif,gif,jpeg,jpg,png,webp}",
  { import: "default", eager: true },
);

export function byArticleDate<T extends { data: { date: string; title: string } }>(entries: T[]) {
  return [...entries].sort(
    (a, b) => b.data.date.localeCompare(a.data.date) || a.data.title.localeCompare(b.data.title),
  );
}

/** Explicit cover, or the first image file in the article folder. */
export function articleCover(entry: CollectionEntry<"articles">): ImageMetadata | undefined {
  if (entry.data.cover) return entry.data.cover;
  const marker = `/articles/${entry.id}/`;
  const matches = Object.entries(articleImages)
    .filter(([file]) => file.replaceAll("\\", "/").includes(marker))
    .sort(([a], [b]) => a.localeCompare(b));
  return matches[0]?.[1];
}
