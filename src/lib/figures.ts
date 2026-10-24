/** "Fig. 01 — Munich" or "Fig. 01 — Munich, 06.2022" when a month is known. */
export function figCaption(index: number, place: string, date: string): string {
  const fig = `Fig. ${String(index).padStart(2, "0")}`;
  if (date) return `${fig} — ${place}, ${date}`;
  return `${fig} — ${place}`;
}
