import { slugify } from "@utils/slugify";

export interface NormalizeOptions {
  /** Raw query params object (URLSearchParams converted) */
  params: URLSearchParams;
  /** When true, will migrate `indemand` -> `occupation` if possible */
  migrateInDemand?: boolean;
  /** Occupation title lookup by id or slug (async external fetch) */
  resolveOccupationById?: (id: string) => Promise<{ id: string; title: string } | undefined>;
  /** Occupation lookup returning id & title given a slug */
  resolveOccupationBySlug?: (slug: string) => Promise<{ id: string; title: string } | undefined>;
  /** Optional pathway(field) title lookup by occupation id */
  resolveFieldForOccupationId?: (id: string) => Promise<{ title: string } | undefined>;
}

export interface NormalizedResult {
  /** Final ordered query string (without leading ?) */
  query: string;
  /** Chosen occupation slug (if any) */
  occupationSlug?: string;
  /** Chosen field slug (if any) */
  fieldSlug?: string;
  /** Whether any mutation occurred */
  changed: boolean;
}

/** Order of params we enforce (occupation always last when present) */
const ORDER = ["field", "occupation"] as const;

/** Build the ordered query string */
function buildOrderedQuery(params: URLSearchParams): string {
  const pieces: string[] = [];
  for (const key of ORDER) {
    const val = params.get(key);
    if (val) pieces.push(`${key}=${encodeURIComponent(val)}`);
  }
  return pieces.join("&");
}

/** Ensure occupation param value is a slug (convert id or raw title) */
function ensureSlug(value: string, titleIfKnown?: string): string {
  if (!value) return value;
  // If already looks slugified (no spaces / uppercase) assume fine
  if (!/[A-Z\s]/.test(value)) return value; // simple heuristic
  return slugify(titleIfKnown ?? value);
}

/**
 * Normalize parameters for career pathways pages.
 * - Migrates indemand -> occupation (slug) if requested
 * - Removes indemand after migration
 * - Ensures ordering (field first, occupation last)
 * - Ensures occupation parameter is slugified
 */
export async function normalizeCareerPathwaysParams(opts: NormalizeOptions): Promise<NormalizedResult> {
  const { params, migrateInDemand, resolveOccupationById, resolveOccupationBySlug, resolveFieldForOccupationId } = opts;
  const working = new URLSearchParams(params.toString());
  let changed = false;

  // Migration: indemand -> occupation (treat idNumber as occupation id fallback)
  if (migrateInDemand) {
    const inDemand = working.get("indemand");
    if (inDemand) {
      // Attempt to resolve occupation by id (indemand number reused) if resolver provided
      if (resolveOccupationById) {
        try {
          const occ = await resolveOccupationById(inDemand);
          if (occ?.title) {
            working.set("occupation", slugify(occ.title));
            working.delete("indemand");
            changed = true;
          }
        } catch {
          // ignore resolution errors; fallback to keeping indemand until UI interaction
        }
      }
    }
  }

  // Ensure occupation param (if present) is a slug
  const occupationRaw = working.get("occupation");
  if (occupationRaw) {
    let occupationSlug = occupationRaw;
    if (/[A-Z\s]/.test(occupationRaw)) {
      occupationSlug = ensureSlug(occupationRaw);
      if (occupationSlug !== occupationRaw) {
        working.set("occupation", occupationSlug);
        changed = true;
      }
    }

    // Try to derive field if missing
    if (!working.get("field") && resolveOccupationBySlug) {
      try {
        const occ = await resolveOccupationBySlug(occupationSlug);
        if (occ?.id && resolveFieldForOccupationId) {
          const field = await resolveFieldForOccupationId(occ.id);
          if (field?.title) {
            working.set("field", slugify(field.title));
            changed = true;
          }
        }
      } catch {/* silent */}
    }
  }

  // Remove unsupported params (currently we only keep field & occupation)
  for (const key of Array.from(working.keys())) {
    if (!ORDER.includes(key as any)) {
      if (key === "indemand") {
        // Only delete indemand if we successfully produced an occupation param
        if (migrateInDemand && working.get("occupation")) {
          working.delete(key);
          changed = true;
        }
      } else {
        working.delete(key);
        changed = true;
      }
    }
  }

  // Build ordered query
  const query = buildOrderedQuery(working);

  return {
    query,
    occupationSlug: working.get("occupation") || undefined,
    fieldSlug: working.get("field") || undefined,
    changed,
  };
}

// Simple pure helper to reorder and drop unknown params (no async, no migration)
export function reorderCareerPathwaysParamsSimple(params: URLSearchParams): string {
  const filtered = new URLSearchParams();
  for (const key of ORDER) {
    const val = params.get(key);
    if (val) filtered.set(key, val);
  }
  return buildOrderedQuery(filtered);
}
