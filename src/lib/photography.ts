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

export interface CollageItem {
  image: ImageMetadata;
  ratio: number;
  /** This picture's share of the row width, 0–1. Used for the `sizes` hint. */
  share: number;
}

export interface CollageRow {
  items: CollageItem[];
  solo: boolean;
}

/** Pictures per row. A one-picture row is a big plate; three in a row are small. */
const rhythm = [1, 2, 3, 2, 1, 3];

/**
 * Lay an album out as rows of equal height, so every picture keeps its own shape.
 * A portrait never gets a row to itself: it would be taller than the screen.
 */
export function collageRows(images: ImageMetadata[]): CollageRow[] {
  const rows: CollageRow[] = [];
  let at = 0;
  let step = 0;
  while (at < images.length) {
    let count = rhythm[step % rhythm.length];
    step += 1;
    const first = images[at];
    if (count === 1 && first.width < first.height && at + 1 < images.length) count = 2;
    const chunk = images.slice(at, at + count);
    at += chunk.length;
    const total = chunk.reduce((sum, image) => sum + image.width / image.height, 0);
    rows.push({
      solo: chunk.length === 1,
      items: chunk.map((image) => {
        const ratio = image.width / image.height;
        return { image, ratio, share: ratio / total };
      }),
    });
  }
  return rows;
}
