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

const monthIndex = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "2026-08-22" → "22 aug 26". "2025-07" → "jul 25". An empty date stays a dash. */
export function formatRead(raw: string): string {
  const value = raw.trim();
  if (!value) return "—";
  const full = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (full) {
    const month = monthIndex[Number(full[2]) - 1];
    if (!month) return value;
    return `${full[3]} ${month} ${full[1].slice(2)}`;
  }
  const monthOnly = value.match(/^(\d{4})-(\d{2})$/);
  if (monthOnly) {
    const month = monthIndex[Number(monthOnly[2]) - 1];
    if (!month) return value;
    return `${month} ${monthOnly[1].slice(2)}`;
  }
  return formatPoint(value);
}

/** 5 stays "5". 4.5 and 4.25 stay as written. */
export function formatRating(value: number): string {
  if (!Number.isFinite(value)) return "";
  return String(value);
}

/** Larger means more recent. A month without a day sorts after the dated days in that month. */
export function readSortKey(raw: string): number {
  const value = raw.trim();
  const full = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (full) return Number(full[1]) * 10000 + Number(full[2]) * 100 + Number(full[3]);
  const monthOnly = value.match(/^(\d{4})-(\d{2})$/);
  if (monthOnly) return Number(monthOnly[1]) * 10000 + Number(monthOnly[2]) * 100;
  return 0;
}
