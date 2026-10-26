import type { ImageMetadata } from "astro";
import meta from "./article-meta.json";
import { formatCaption } from "./photography";

const images = import.meta.glob<ImageMetadata>("../assets/articles/**/*.{avif,jpeg,jpg,png,webp}", {
  eager: true,
  import: "default",
});

const fileOf = new Map<ImageMetadata, string>();
for (const [file, image] of Object.entries(images)) fileOf.set(image, file.replaceAll("\\", "/"));

/** Pictures for the article with this id, from `src/assets/articles/<id>/`, in filename order. */
export function articleImages(id: string): ImageMetadata[] {
  const marker = `/articles/${id}/`;
  return Object.entries(images)
    .filter(([file]) => file.replaceAll("\\", "/").includes(marker))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map(([, image]) => image);
}

export function articleCaption(image: ImageMetadata): string {
  const key = fileOf.get(image)?.match(/articles\/([^/]+\/[^/]+)$/)?.[1];
  return formatCaption(key ? (meta as Record<string, { device: string | null; date: string | null }>)[key] : undefined);
}
