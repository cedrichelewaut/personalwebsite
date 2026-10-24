import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import photos from "../data/photographs.json";
import { hasNote, isLive } from "../lib/content";
import { loadSeries } from "../lib/series";

export const GET: APIRoute = async () => {
  const [work, study, projects, reading, workSets, studySets, projectSets, photoSets, readingSets] =
    await Promise.all([
      getCollection("work"),
      getCollection("study"),
      getCollection("projects"),
      getCollection("reading"),
      loadSeries("work"),
      loadSeries("study"),
      loadSeries("projects"),
      loadSeries("photographs"),
      loadSeries("reading"),
    ]);

  const paths = [
    "/",
    "/work/",
    "/study/",
    "/projects/",
    "/photographs/",
    "/reading/",
    "/marathoning/",
    "/contact/",
    ...work.filter(isLive).map((entry) => `/work/${entry.id}/`),
    ...study.filter(isLive).map((entry) => `/study/${entry.id}/`),
    ...projects.filter(isLive).map((entry) => `/projects/${entry.id}/`),
    ...reading.filter((entry) => isLive(entry) && hasNote(entry)).map((entry) => `/reading/${entry.id}/`),
    ...photos.map((photo) => `/photographs/${photo.slug}/`),
    ...workSets.map((entry) => `/work/${entry.id}/`),
    ...studySets.map((entry) => `/study/${entry.id}/`),
    ...projectSets.map((entry) => `/projects/${entry.id}/`),
    ...photoSets.map((entry) => `/photographs/${entry.id}/`),
    ...readingSets.map((entry) => `/reading/${entry.id}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${site.url}${path}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
