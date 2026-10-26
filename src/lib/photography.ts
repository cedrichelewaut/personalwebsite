import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

const images = import.meta.glob<ImageMetadata>(
  "../content/photography/**/*.{avif,gif,jpeg,jpg,JPG,JPEG,png,webp}",
  { eager: true, import: "default" },
);

import meta from "./photo-meta.json";

const fileOf = new Map<ImageMetadata, string>();
for (const [file, image] of Object.entries(images)) fileOf.set(image, file.replaceAll("\\", "/"));

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface PhotoInfo {
  device: string | null;
  date: string | null;
}

/** "iPhone 17 · 14 May 2026": device and capture date, from the original files. Empty if unknown. */
export function formatCaption(info: PhotoInfo | undefined): string {
  if (!info) return "";
  const date = info.date ? info.date.split("-") : null;
  const when = date ? `${Number(date[2])} ${months[Number(date[1]) - 1]} ${date[0]}` : null;
  return [info.device, when].filter(Boolean).join(" · ");
}

export function photoCaption(image: ImageMetadata): string {
  const key = fileOf.get(image)?.match(/photography\/([^/]+\/[^/]+)$/)?.[1];
  return formatCaption(key ? (meta as Record<string, PhotoInfo>)[key] : undefined);
}

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

/** An image in the album folder named `cover`, whatever its extension (case-insensitive). */
function coverImage(slug: string): ImageMetadata | undefined {
  const marker = `/photography/${slug}/`;
  for (const [file, image] of Object.entries(images)) {
    const path = file.replaceAll("\\", "/");
    if (!path.includes(marker)) continue;
    const name = path.split("/").pop() ?? "";
    if (name.replace(/\.[^.]+$/, "").toLowerCase() === "cover") return image;
  }
  return undefined;
}

/** The home thumbnail: a file named `cover.*`, else the frontmatter cover, else the first image. */
export function albumThumb(entry: CollectionEntry<"photography">): ImageMetadata | undefined {
  return coverImage(entry.id) ?? entry.data.cover ?? albumImages(entry.id)[0];
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
