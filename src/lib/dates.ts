const months: Record<string, string> = {
  jan: "jan",
  january: "jan",
  feb: "feb",
  february: "feb",
  mar: "mar",
  march: "mar",
  apr: "apr",
  april: "apr",
  may: "may",
  jun: "jun",
  june: "jun",
  jul: "jul",
  july: "jul",
  aug: "aug",
  august: "aug",
  sep: "sep",
  sept: "sep",
  september: "sep",
  oct: "oct",
  october: "oct",
  nov: "nov",
  november: "nov",
  dec: "dec",
  december: "dec",
};

/** "Sept. 2025" → "sep 25". "12 May 2026" → "12 may 26". Days are omitted when the source has none. */
export function formatPoint(raw: string): string {
  const cleaned = raw.trim().toLowerCase().replaceAll(".", "");
  if (cleaned === "present") return "present";
  const withDay = cleaned.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (withDay) {
    const month = months[withDay[2]];
    if (!month) return cleaned;
    return `${withDay[1].padStart(2, "0")} ${month} ${withDay[3].slice(2)}`;
  }
  const match = cleaned.match(/^([a-z]+)\s+(\d{4})$/);
  if (!match) return cleaned;
  const month = months[match[1]];
  if (!month) return cleaned;
  return `${month} ${match[2].slice(2)}`;
}

/** "sep 25 > present", or one point when both ends are the same. */
export function formatRange(start: string, end: string): string {
  const from = formatPoint(start);
  const to = formatPoint(end);
  if (from === to) return from;
  return `${from} > ${to}`;
}
