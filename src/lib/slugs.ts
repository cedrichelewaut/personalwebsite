/** A single book, project, photograph, or role. Not a catalogue code. */
export const readableSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A finished collection: short prefix, underscore, number. F_02, CV_01, W_014. */
export const collectionCode = /^[A-Z]{1,3}_\d{2,3}$/;

export function assertReadableSlug(id: string, label: string) {
  if (!readableSlug.test(id)) {
    throw new Error(
      `${label} use a readable slug such as munich or field-notes. A catalogue code belongs on a finished collection, not on a single item. Got ${id}.`,
    );
  }
}
