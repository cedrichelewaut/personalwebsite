import { getCollection } from "astro:content";
import { byOrder, isLive } from "./content";
import { assertReadableSlug } from "./slugs";

export const sections = ["work", "study", "projects", "reading"] as const;
export type SectionName = (typeof sections)[number];

export async function loadSeries(section: SectionName, reserved: string[] = []) {
  const all = await getCollection("series");
  for (const entry of all) assertReadableSlug(entry.id, "Collections");
  const sets = byOrder(all.filter((entry) => isLive(entry) && entry.data.section === section));
  for (const entry of sets) {
    if (reserved.includes(entry.id)) {
      throw new Error(`Collection “${entry.id}” uses the same slug as an item in ${section}.`);
    }
  }
  return sets;
}
