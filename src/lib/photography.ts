import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

const images = import.meta.glob<ImageMetadata>(
  "../content/photography/**/*.{avif,gif,jpeg,jpg,png,webp}",
  { eager: true, import: "default" },
);

/** Every image in an album folder, sorted by filename. `01.jpg` comes before `10.jpg`. */
export function albumImages(slug: string): ImageMetadata[] {
  const marker = `/photography/${slug}/`;
  return Object.entries(images)
    .filter(([file]) => file.replaceAll("\\", "/").includes(marker))
    .sort(([a], [b]) => {
      const nameA = a.split(/[/\\]/).pop() ?? a;
      const nameB = b.split(/[/\\]/).pop() ?? b;
      return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });
    })
    .map(([, image]) => image);
}

/** The home thumbnail: the cover, or the first image in the folder. */
export function albumThumb(entry: CollectionEntry<"photography">): ImageMetadata | undefined {
  return entry.data.cover ?? albumImages(entry.id)[0];
}

export function byAlbumDate(entries: CollectionEntry<"photography">[]) {
  return [...entries].sort(
    (a, b) => (a.data.date < b.data.date ? 1 : a.data.date > b.data.date ? -1 : a.id.localeCompare(b.id)),
  );
}
