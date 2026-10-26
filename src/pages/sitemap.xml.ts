import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site, sections } from "../site";
import { hasNote, isLive } from "../lib/content";
import { loadSeries } from "../lib/series";

export const GET: APIRoute = async () => {
  const [work, study, projects, reading, posts, albums, workSets, studySets, projectSets, readingSets] =
    await Promise.all([
      getCollection("work"),
      getCollection("study"),
      getCollection("projects"),
      getCollection("reading"),
      getCollection("blog"),
      getCollection("photography"),
      loadSeries("work"),
      loadSeries("study"),
      loadSeries("projects"),
      loadSeries("reading"),
    ]);

  const paths = [
    "/",
    ...(sections.bookshelf ? ["/reading/"] : []),
    "/privacy/",
    ...(sections.blog ? posts.filter(isLive).map((entry) => `/blog/${entry.id}/`) : []),
    ...(sections.photos ? albums.filter(isLive).map((entry) => `/photography/${entry.id}/`) : []),
    ...(sections.work ? work.filter(isLive).map((entry) => `/work/${entry.id}/`) : []),
    ...(sections.study ? study.filter(isLive).map((entry) => `/study/${entry.id}/`) : []),
    ...(sections.projects ? projects.filter((entry) => isLive(entry) && !entry.data.locked).map((entry) => `/projects/${entry.id}/`) : []),
    ...(sections.bookshelf
      ? reading.filter((entry) => isLive(entry) && hasNote(entry)).map((entry) => `/reading/${entry.id}/`)
      : []),
    ...(sections.work ? workSets.map((entry) => `/work/${entry.id}/`) : []),
    ...(sections.study ? studySets.map((entry) => `/study/${entry.id}/`) : []),
    ...(sections.projects ? projectSets.map((entry) => `/projects/${entry.id}/`) : []),
    ...(sections.bookshelf ? readingSets.map((entry) => `/reading/${entry.id}/`) : []),
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
