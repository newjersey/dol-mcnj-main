import { slugify } from "@utils/slugify";

export interface PathwayLike {
  title: string;
  occupationsCollection?: { items?: { title: string }[] };
}

export function findPathwayForOccupationSlug(pathways: PathwayLike[] | undefined, occupationSlug: string) {
  if (!pathways || !occupationSlug) return undefined;
  return pathways.find(p => p.occupationsCollection?.items?.some(o => slugify(o.title) === occupationSlug));
}

export function computeCorrectFieldSlug(pathways: PathwayLike[] | undefined, occupationSlug: string): string | undefined {
  const p = findPathwayForOccupationSlug(pathways, occupationSlug);
  return p ? slugify(p.title) : undefined;
}
