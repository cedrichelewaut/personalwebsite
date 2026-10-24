import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import { hasNote, isLive } from "../lib/content";
import { loadSeries } from "../lib/series";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

interface FeedItem {
  title: string;
  path: string;
  summary: string;
  date: string;
}

export const GET: APIRoute = async () => {
  const [work, study, projects, reading, ...sets] = await Promise.all([
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
  const series = sets.flat();

  const items: FeedItem[] = [
    ...work
      .filter((entry) => isLive(entry) && hasNote(entry) && entry.data.noteDate)
      .map((entry) => ({
        title: entry.data.title,
        path: `/work/${entry.id}/`,
        summary: entry.data.summary,
        date: entry.data.noteDate as string,
      })),
    ...study
      .filter((entry) => isLive(entry) && hasNote(entry) && entry.data.noteDate)
      .map((entry) => ({
        title: entry.data.title,
        path: `/study/${entry.id}/`,
        summary: entry.data.summary,
        date: entry.data.noteDate as string,
      })),
    ...projects
      .filter((entry) => isLive(entry) && hasNote(entry) && entry.data.noteDate)
      .map((entry) => ({
        title: entry.data.title,
        path: `/projects/${entry.id}/`,
        summary: entry.data.summary,
        date: entry.data.noteDate as string,
      })),
    ...reading
      .filter((entry) => isLive(entry) && hasNote(entry) && entry.data.noteDate)
      .map((entry) => ({
        title: entry.data.title,
        path: `/reading/${entry.id}/`,
        summary: entry.data.summary || entry.data.title,
        date: entry.data.noteDate as string,
      })),
    ...series
      .filter((entry) => hasNote(entry) && entry.data.noteDate)
      .map((entry) => ({
        title: entry.data.title,
        path: `/${entry.data.section}/${entry.id}/`,
        summary: entry.data.summary,
        date: entry.data.noteDate as string,
      })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}/</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${site.url}${item.path}</link>
      <guid>${site.url}${item.path}</guid>
      <pubDate>${new Date(`${item.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
