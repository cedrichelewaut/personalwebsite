export function isLive<T extends { data: { draft?: boolean } }>(entry: T) {
  return !entry.data.draft;
}

export function hasNote<T extends { body?: string }>(entry: T) {
  return Boolean(entry.body && entry.body.trim().length > 0);
}

export function byOrder<T extends { data: { order: number; title: string } }>(entries: T[]) {
  return [...entries].sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export function neighbours<T extends { id: string }>(entries: T[], id: string) {
  const index = entries.findIndex((entry) => entry.id === id);
  return {
    newer: index > 0 ? entries[index - 1] : undefined,
    older: index >= 0 && index < entries.length - 1 ? entries[index + 1] : undefined,
  };
}
