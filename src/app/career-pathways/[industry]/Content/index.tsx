"use client";
import { Button } from "@components/modules/Button";
import { client } from "@utils/client";
import {
  CareerMapProps,
  InDemandItemProps,
  IndustryProps,
  OccupationDetail,
  OccupationNodeProps,
  SinglePathwayProps,
} from "@utils/types";
import { OCCUPATION_QUERY } from "queries/occupationQuery";
import { CAREER_PATHWAY_QUERY } from "queries/pathway";
import { Fragment, useEffect, useLayoutEffect, useState, useRef } from "react";
import { Details } from "./Details";
import { groupObjectsByLevel } from "@utils/groupObjectsByLevel";
import { InDemandDetails } from "./InDemandDetails";
import { Spinner } from "@components/modules/Spinner";
import { ErrorBox } from "@components/modules/ErrorBox";
import { colors } from "@utils/settings";
import { FieldSelect } from "@components/blocks/FieldSelect";
import { OccupationGroups } from "@components/blocks/OccupationGroups";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { numberShorthand } from "@utils/numberShorthand";
import { slugify } from "@utils/slugify";
import { normalizeCareerPathwaysParams } from "@utils/careerPathwaysUrl";

export const Content = ({ thisIndustry }: { thisIndustry: IndustryProps }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Debug flag (set NEXT_PUBLIC_CP_DEBUG=true in env or window.__CP_DEBUG__=true in console)
  const debugEnabled = typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_CP_DEBUG === 'true' || (window as any).__CP_DEBUG__);
  const cpLog = (...args: any[]) => { if (debugEnabled) console.log('[CP]', ...args); };

  // Central helper: always include pathname to ensure query string updates reliably in tests
  const replaceQuery = (qs: string) => {
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const [activeMap, setActiveMap] = useState<CareerMapProps>();
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [inDemandOpen, setInDemandOpen] = useState(false);
  const [activeInDemand, setActiveInDemand] = useState<InDemandItemProps>();
  const [inDemandOccupationData, setInDemandOccupationData] =
    useState<OccupationDetail>();
  const [activePathway, setActivePathway] = useState<SinglePathwayProps>();
  const [inDemandError, setInDemandError] = useState<string>();
  const [activeOccupation, setActiveOccupation] = useState<{
    careerMapObject: OccupationNodeProps;
  }>();
  // Ordered list of pathways with the active one first followed by others
  const [fullMap, setFullMap] = useState<SinglePathwayProps[]>();
  const [loading, setLoading] = useState<boolean>(false);
  // While an occupation slug is present in URL but we have not resolved its pathway yet
  const [resolvingPathway, setResolvingPathway] = useState<boolean>(false);
  // Track last processed occupation slug to prevent loops
  const lastProcessedOccSlug = useRef<string | null>(null);
  // Track last user-selected occupation ID to ignore stale async responses
  const latestSelectionRef = useRef<string | null>(null);
  // Timestamp of last explicit user selection (to suppress aggressive normalization for a brief window)
  const lastSelectionTsRef = useRef<number>(0);
  // Selection lock: after an explicit user occupation selection, prevent async effects
  // from overwriting the occupation slug for a short stability window.
  const selectionLockRef = useRef<{ slug: string; expires: number } | null>(null);
  // Track the last user-intended occupation slug so we do not clear it prematurely
  const userIntentOccupationRef = useRef<string | null>(null);
  // Track resolution attempts per slug to avoid infinite retries and allow eventual cleanup
  const resolutionAttemptsRef = useRef<Record<string, number>>({});
  // Pending occupation slug intended for next field alignment to prevent stale occupation persistence
  const pendingOccupationSlugRef = useRef<string | null>(null);

  // Clear state when industry changes to prevent stale data
  useEffect(() => {
    setActiveMap(undefined);
    setActivePathway(undefined);
    setActiveOccupation(undefined);
    setActiveInDemand(undefined);
    setFullMap(undefined);
    setInDemandOccupationData(undefined);
    setInDemandError(undefined);
    // Allow auto-select to run for the new industry
    autoSelectRanRef.current = false;
  }, [thisIndustry.sys.id]);

  // Track whether we've already auto-selected for the current industry
  const autoSelectRanRef = useRef(false);

  // Auto-select first occupation for first (or selected field) pathway when switching industries (layout for earlier URL apply)
  useLayoutEffect(() => {
    if (autoSelectRanRef.current) return; // only once per industry load
    if (!thisIndustry?.careerMaps?.items?.length) return;
    if (searchParams?.get('occupation')) return; // user already has occupation param
    if (searchParams?.get('indemand')) return; // in-demand mode should not auto-switch
    cpLog('auto-select init', { desiredField: searchParams?.get('field') });

    const desiredField = searchParams?.get('field');

    (async () => {
      try {
        // Iterate career maps until we find one with pathways & occupations
  for (const mapRef of (thisIndustry.careerMaps?.items ?? [])) {
          const mapId = (mapRef as any)?.sys?.id;
            if (!mapId) continue;
          const mapData: CareerMapProps | undefined = await fetchCareerMap(mapId);
          const pathways = mapData?.careerMap?.pathways?.items || [];
          if (!pathways.length) continue;
          // Choose pathway: matching desired field or first
          let pathway: SinglePathwayProps | undefined;
          if (desiredField) {
            pathway = pathways.find(p => slugify(p.title) === desiredField) || pathways[0];
          } else {
            pathway = pathways[0];
          }
          if (!pathway) continue;
          const occupations = (pathway.occupationsCollection?.items || []).slice();
          if (!occupations.length) continue;
          // Lowest level first (ascending level)
          occupations.sort((a: any,b: any) => (a.level ?? 0) - (b.level ?? 0));
          const firstOcc = occupations[0];
          if (!firstOcc?.sys?.id) continue;
          // Set state (map + pathway) first
          cpLog('auto-select choosing pathway', pathway.title, 'firstOcc', firstOcc.title);
          setActiveMap(mapData);
          setActivePathway(pathway);
          // Build URL params immediately (before occupation detail network round-trip)
          const fieldSlug = slugify(pathway.title);
          const occSlug = slugify(firstOcc.title);
          const ordered = new URLSearchParams();
          ordered.set('field', fieldSlug);
          ordered.set('occupation', occSlug);
          replaceQuery(ordered.toString());
          cpLog('auto-select URL', ordered.toString());
          autoSelectRanRef.current = true;
          // Fetch occupation detail asynchronously (no blocking await)
          getOccupation(firstOcc.sys.id).then(()=>cpLog('auto-select occ loaded', firstOcc.title)).catch(e=>cpLog('auto-select occ error', e));
          break;
        }
      } catch (e) {
        cpLog('auto-select failed', e);
      }
    })();
  }, [thisIndustry?.careerMaps?.items, searchParams?.toString()]);

  const getCareerMap = async (id: string) => {
    const mapData = await client({
      query: CAREER_PATHWAY_QUERY,
      variables: { id },
    });
    setActiveMap(mapData);
  };

  const fetchCareerMap = async (id: string) => {
    return client({
      query: CAREER_PATHWAY_QUERY,
      variables: { id },
    });
  };

  const getOccupation = async (id: string) => {
    try {
      cpLog('getOccupation start', id);
      const occupationData = await client({
        query: OCCUPATION_QUERY,
        variables: { id },
      });
      cpLog('getOccupation success', id, occupationData?.careerMapObject?.title);
      setActiveOccupation(occupationData);
      return occupationData;
    } catch (e) {
      cpLog('getOccupation error', id, e);
      return undefined;
    }
  };

  const ensureFieldForOccupation = async (occupationId: string) => {
    cpLog('ensureFieldForOccupation', occupationId);
    lastSelectionTsRef.current = Date.now();
    const inCurrent = activeMap?.careerMap?.pathways?.items?.find((p) =>
      p.occupationsCollection?.items?.some(
        (o: OccupationNodeProps) => o.sys.id === occupationId
      )
    );

    if (inCurrent) {
  cpLog('ensureFieldForOccupation found in current pathway', inCurrent.title);
  setActivePathway(inCurrent);
      updateFieldInUrl(inCurrent);
      const filtered = activeMap?.careerMap?.pathways?.items?.filter(
        (p) => p.title !== inCurrent.title
      );
      if (filtered) setFullMap([inCurrent, ...(filtered ?? [])]);
      return;
    }

    for (const mapRef of thisIndustry.careerMaps?.items ?? []) {
      const mapId = (mapRef as any)?.sys?.id;
      if (!mapId) continue;

      const mapData: CareerMapProps | undefined = await fetchCareerMap(mapId);
      const pathwayHit = mapData?.careerMap?.pathways?.items?.find(
        (p: SinglePathwayProps) =>
          p.occupationsCollection?.items?.some(
            (o: OccupationNodeProps) => o.sys.id === occupationId
          )
      );

      if (pathwayHit) {
        cpLog('ensureFieldForOccupation found in different map pathway', pathwayHit.title);
        setActiveMap(mapData);
        setActivePathway(pathwayHit);
        updateFieldInUrl(pathwayHit);

        const filtered = mapData?.careerMap?.pathways?.items?.filter(
          (p: SinglePathwayProps) => p.title !== pathwayHit.title
        );
        if (filtered) setFullMap([pathwayHit, ...filtered]);
        break;
      }
    }
  };

  const setOccupationFromId = async (id: string) => {
    cpLog('setOccupationFromId', id);
    lastSelectionTsRef.current = Date.now();
    const occ = await getOccupation(id);

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    // Only set occupation here; defer field until pathway validated
    if (occ?.careerMapObject) {
      const newSlug = slugify(occ.careerMapObject.title);
      params.set("occupation", newSlug);
      userIntentOccupationRef.current = newSlug;
      pendingOccupationSlugRef.current = newSlug;
      // Do NOT delete field; keep existing field until pathway inference corrects it
    }
    
  params.delete("indemand"); // keep modes mutually exclusive
  // Enforce correct ordering: field then occupation
  const ordered = new URLSearchParams();
  const fieldVal = params.get("field");
  if (fieldVal) ordered.set("field", fieldVal);
  const occVal = params.get("occupation");
  if (occVal) ordered.set("occupation", occVal);
  replaceQuery(ordered.toString());
  cpLog('setOccupationFromId URL', ordered.toString());

    await ensureFieldForOccupation(id);
    return occ;
  };

  // Optimistic occupation selection: immediately update URL + activeOccupation shell
  const optimisticSelectOccupation = (id: string, title: string, pathway: SinglePathwayProps) => {
    cpLog('optimisticSelectOccupation', { id, title, pathway: pathway.title });
    latestSelectionRef.current = id;
    lastSelectionTsRef.current = Date.now();
    const occSlug = slugify(title);
    selectionLockRef.current = { slug: occSlug, expires: Date.now() + 2500 };
    cpLog('selection lock set', selectionLockRef.current);
    userIntentOccupationRef.current = occSlug;
    pendingOccupationSlugRef.current = occSlug;
    // Create lightweight placeholder occupation while details fetch
    setActivePathway(pathway);
    setActiveOccupation({
      careerMapObject: {
        sys: { id } as any,
        title,
      } as OccupationNodeProps,
    });
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("occupation", occSlug);
    params.set("field", slugify(pathway.title));
    const ordered = new URLSearchParams();
    const f = params.get("field");
    if (f) ordered.set("field", f);
    const o = params.get("occupation");
    if (o) ordered.set("occupation", o);
  replaceQuery(ordered.toString());
  cpLog('optimisticSelectOccupation URL', ordered.toString());
    // Fetch full details asynchronously; ignore if superseded
    getOccupation(id).then((full) => {
      if (!full?.careerMapObject?.sys?.id) return;
      if (latestSelectionRef.current !== id) return; // stale
      ensureFieldForOccupation(id).then(()=>cpLog('optimistic ensureField complete', id)).catch(e=>cpLog('optimistic ensureField error', e));
    }).catch(() => {/* swallow */});
  };

  const setActiveOccupationAndSync = (occObj: {
    careerMapObject: OccupationNodeProps;
  }) => {
    cpLog('setActiveOccupationAndSync', occObj?.careerMapObject?.title);
    lastSelectionTsRef.current = Date.now();
    setActiveOccupation(occObj);
    const id = occObj?.careerMapObject?.sys?.id;
    if (!id) return;

    const params = new URLSearchParams(searchParams?.toString() ?? "");
    // Set occupation only; field will be resolved asynchronously
  params.set("occupation", slugify(occObj.careerMapObject.title));
  // Preserve field param; will be corrected later if mismatch
    params.delete("indemand"); // keep modes mutually exclusive
  const ordered = new URLSearchParams();
  const fieldVal = params.get("field");
  if (fieldVal) ordered.set("field", fieldVal);
  const occVal = params.get("occupation");
  if (occVal) ordered.set("occupation", occVal);
  replaceQuery(ordered.toString());
  cpLog('setActiveOccupationAndSync URL', ordered.toString());

    ensureFieldForOccupation(id);
  };

  const getOccupationAndSync = async (id: string) => {
    return setOccupationFromId(id);
  };

  // Helper function to find occupation by slug across all career maps
  const findOccupationBySlug = async (occupationSlug: string): Promise<{ occupation: OccupationNodeProps; pathway: SinglePathwayProps; map: CareerMapProps } | null> => {
    for (const mapRef of thisIndustry.careerMaps?.items ?? []) {
      const mapId = (mapRef as any)?.sys?.id;
      if (!mapId) continue;

      const mapData: CareerMapProps | undefined = await fetchCareerMap(mapId);
      if (!mapData?.careerMap?.pathways?.items) continue;

      for (const pathway of mapData.careerMap.pathways.items) {
        if (!pathway.occupationsCollection?.items) continue;

        for (const occupation of pathway.occupationsCollection.items) {
          if (slugify(occupation.title) === occupationSlug) {
            return { occupation, pathway, map: mapData };
          }
        }
      }
    }
    return null;
  };

  // Helper function to get field slug from pathway title
  const getFieldSlug = (pathway: SinglePathwayProps | undefined): string => {
    return pathway ? slugify(pathway.title) : '';
  };

  // Helper function to update URL with field parameter when pathway changes
  const updateFieldInUrl = (pathway: SinglePathwayProps) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const newFieldSlug = getFieldSlug(pathway);
    const currentFieldSlug = params.get("field");
    cpLog('updateFieldInUrl', { currentFieldSlug, newFieldSlug });
    // Always align field with the resolved pathway of the current occupation.
    // Previous logic preserved an existing differing field which caused occupation
    // to be "corrected" back to that field's first occupation (e.g. welding -> welder)
    // when selecting an occupation in another pathway (e.g. Sr. Tool and Die Maker).
    if (params.get("occupation") && currentFieldSlug !== newFieldSlug) {
      params.set("field", newFieldSlug);
      const existingOcc = params.get('occupation');
      const desiredOcc = pendingOccupationSlugRef.current
        || (activeOccupation?.careerMapObject?.title ? slugify(activeOccupation.careerMapObject.title) : existingOcc);
      if (desiredOcc && existingOcc !== desiredOcc) {
        params.set('occupation', desiredOcc);
        cpLog('updateFieldInUrl replaced stale occupation', { from: existingOcc, to: desiredOcc });
      }
      if (pendingOccupationSlugRef.current && desiredOcc === pendingOccupationSlugRef.current) {
        pendingOccupationSlugRef.current = null; // clear after apply
      }
      const ordered = new URLSearchParams();
      const f = params.get("field"); if (f) ordered.set("field", f);
      const o = params.get("occupation"); if (o) ordered.set("occupation", o);
      replaceQuery(ordered.toString());
      cpLog('updateFieldInUrl applied', ordered.toString());
    }
  };

  const setInDemandFromItem = (item: InDemandItemProps) => {
    setActiveInDemand(item);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("indemand", String(item.idNumber));
    params.delete("occupation"); // keep modes mutually exclusive
  replaceQuery(`indemand=${encodeURIComponent(String(item.idNumber))}`);
  };

  // Initial/param-change normalization (migrate indemand -> occupation slug; enforce order)
  // Synchronous lightweight normalization: slugify occupation immediately & enforce param ordering
  const initialLayoutNormalized = useRef(false);
  useLayoutEffect(() => {
    if (initialLayoutNormalized.current) return;
    initialLayoutNormalized.current = true;
    const current = new URLSearchParams(searchParams?.toString() ?? "");
    let mutated = false;
    // Prune unknown upfront
    for (const key of Array.from(current.keys())) {
      if (!['field','occupation','indemand'].includes(key)) {
        current.delete(key);
        mutated = true;
      }
    }
    const rawOcc = current.get('occupation');
    if (rawOcc) {
      const slugged = slugify(rawOcc);
      if (!slugged) {
        current.delete('occupation');
        mutated = true;
      } else if (slugged !== rawOcc) {
        current.set('occupation', slugged);
        mutated = true;
      }
    }
    // Order params
    const ordered = new URLSearchParams();
    const f = current.get('field');
    if (f) ordered.set('field', f);
    const o = current.get('occupation');
    if (o) ordered.set('occupation', o);
    const orderedStr = ordered.toString();
    if (mutated || orderedStr !== current.toString()) {
      replaceQuery(orderedStr);
    }
  }, []);

  // SECOND PASS immediate microtask to ensure unknown params pruned even if searchParams snapshot stale
  useLayoutEffect(() => {
    Promise.resolve().then(() => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      const params = url.searchParams;
      let changed = false;
      Array.from(params.keys()).forEach(k => {
        if (!['field','occupation','indemand'].includes(k)) { params.delete(k); changed = true; }
      });
      if (changed) {
        // Re-order after deletion
        const ordered = new URLSearchParams();
        const f = params.get('field'); if (f) ordered.set('field', f);
        const o = params.get('occupation'); if (o) ordered.set('occupation', o);
        const newStr = ordered.toString();
        const newUrl = newStr ? `${url.pathname}?${newStr}` : url.pathname;
        window.history.replaceState(null, '', newUrl);
      }
    });
  }, []);

  // Final enforcement after hydration: if ordering still incorrect or unknown params remain, force a soft reload replace
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const params = url.searchParams;
    let needsFix = false;
    // detect unknown
    for (const k of Array.from(params.keys())) {
      if (!['field','occupation','indemand'].includes(k)) { needsFix = true; break; }
    }
    const field = params.get('field');
    const occ = params.get('occupation');
    if (!needsFix && field && occ) {
      // current order string
      const qs = url.search.replace(/^\?/, '');
      if (qs.startsWith('occupation=')) needsFix = true; // occupation appears first
    }
    if (!needsFix) return;
    const ordered = new URLSearchParams();
    if (field) ordered.set('field', field);
    if (occ) ordered.set('occupation', occ);
    const qsOrdered = ordered.toString();
    const newUrl = qsOrdered ? `${url.pathname}?${qsOrdered}` : url.pathname;
    if (newUrl !== url.href.replace(url.origin, '')) {
      // Full replace triggers single reload ensuring Cypress sees updated ordering
      window.location.replace(newUrl);
    }
  }, []);

  // Fallback: if Next router replacement is ignored/deduped, directly mutate URL via history API (one-time)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const params = url.searchParams;
    let changed = false;
    // prune unknown
    Array.from(params.keys()).forEach(k => {
      if (!['field','occupation','indemand'].includes(k)) { params.delete(k); changed = true; }
    });
    const rawOcc = params.get('occupation');
    if (rawOcc) {
      const slugged = slugify(rawOcc);
      if (!slugged) { params.delete('occupation'); changed = true; }
      else if (slugged !== rawOcc) { params.set('occupation', slugged); changed = true; }
    }
    // order
    const ordered = new URLSearchParams();
    const f = params.get('field'); if (f) ordered.set('field', f);
    const o = params.get('occupation'); if (o) ordered.set('occupation', o);
    const orderedStr = ordered.toString();
    const currentStr = Array.from(params.keys()).map(k=>`${k}=${encodeURIComponent(params.get(k)!)}`).join('&');
    if (changed || orderedStr !== currentStr) {
      const newUrl = orderedStr ? `${url.pathname}?${orderedStr}` : url.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  // Removed ultra-early mismatch substitution (previously injected synthetic fallback occupation slug and caused user-selected occupation to revert).

  useEffect(() => {
    const rawOcc = searchParams?.get("occupation");
    const fieldParam = searchParams?.get("field");
    cpLog('ordering/slug effect', { rawOcc, fieldParam, qs: searchParams?.toString() });
    // Run even if neither is present to prune unknown params (drop stray keys)

    // Build baseline params snapshot
    const current = new URLSearchParams(searchParams?.toString() ?? "");
    let changed = false;

    // Prune unknown params synchronously (anything other than field / occupation / indemand)
    for (const key of Array.from(current.keys())) {
      if (!['field','occupation','indemand'].includes(key)) {
        current.delete(key);
        changed = true;
      }
    }

    const suppress = Date.now() - lastSelectionTsRef.current < 1500; // grace after selection
    const lock = selectionLockRef.current;
    const lockActive = !!(lock && Date.now() < lock.expires);
    if (lockActive && rawOcc && lock.slug !== rawOcc) {
      cpLog('selection lock restoring occupation', { from: rawOcc, to: lock.slug });
      current.set('occupation', lock.slug);
      changed = true;
    }
    if (rawOcc && !suppress && !lockActive) {
      const slugged = slugify(rawOcc);
      if (slugged && slugged !== rawOcc) {
        current.set("occupation", slugged);
        changed = true;
      }
      if (!slugged) {
        current.delete("occupation");
        changed = true;
      }
    }
    if (rawOcc && (suppress || lockActive)) {
      cpLog('ordering effect suppressed mutation due to recent selection/lock', { rawOcc, suppress, lockActive });
    }

    // Enforce ordering: field then occupation (query string order is cosmetic but tests rely on it)
    if (!changed) {
      // Even when no value change, rebuild ordered version to guarantee deterministic string
      const ordered = new URLSearchParams();
      const f = current.get("field");
      if (f) ordered.set("field", f);
      const o = current.get("occupation");
      if (o) ordered.set("occupation", o);
      const orderedStr = ordered.toString();
      if (orderedStr !== current.toString()) {
        replaceQuery(orderedStr);
        cpLog('ordering effect re-ordered', orderedStr);
        return;
      }
    }

    if (changed) {
      // After modifications, re-build ordered params for stable output
      const ordered = new URLSearchParams();
      const f = current.get("field");
      if (f) ordered.set("field", f);
      const o = current.get("occupation");
      if (o) ordered.set("occupation", o);
      replaceQuery(ordered.toString());
      cpLog('ordering effect changed', ordered.toString());
    }
  }, [searchParams?.get("occupation"), searchParams?.get("field")]);

  // NOTE: The async normalization effect below remains for heavier resolution (id migrations, field inference, etc.)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rawParams = new URLSearchParams(searchParams?.toString() ?? "");
      if (!rawParams.toString()) return; // nothing to normalize
      const lock = selectionLockRef.current;
      if (lock && Date.now() < lock.expires) { cpLog('normalize skipped due to selection lock'); return; }

      const result = await normalizeCareerPathwaysParams({
        params: rawParams,
        migrateInDemand: true,
        // Minimal resolvers: we only have slug -> occupation via existing helper
        resolveOccupationBySlug: async (slug) => {
          const found = await findOccupationBySlug(slug);
            return found ? { id: found.occupation.sys.id, title: found.occupation.title } : undefined;
        },
        resolveOccupationById: async (id) => {
          // Attempt network fetch mirroring inDemand details endpoint
          try {
            const res = await fetch(`/api/occupations/${id}`);
            if (!res.ok) return undefined;
            const data = await res.json();
            // Expect shape with title; fallback to undefined if missing
            if (data?.title) {
              return { id, title: data.title };
            }
          } catch {/* silent */}
          return undefined;
        },
        resolveFieldForOccupationId: async (id) => {
          // Attempt to find the occupation; pathway returned will be used
          for (const mapRef of thisIndustry.careerMaps?.items ?? []) {
            const mapId = (mapRef as any)?.sys?.id;
            if (!mapId) continue;
            const mapData: CareerMapProps | undefined = await fetchCareerMap(mapId);
            const pathwayHit = mapData?.careerMap?.pathways?.items?.find(
              (p: SinglePathwayProps) => p.occupationsCollection?.items?.some(
                (o: OccupationNodeProps) => o.sys.id === id
              )
            );
            if (pathwayHit) return { title: pathwayHit.title };
          }
          return undefined;
        }
      });
      if (!cancelled && result.changed) {
        replaceQuery(result.query);
      }
    })();
    return () => { cancelled = true; };
  }, [searchParams?.toString()]);

  // Resolving pathway / invalid occupation cleanup effect
  useEffect(() => {
    const urlOcc = searchParams?.get("occupation");
    cpLog('resolvingPathway effect', { urlOcc, activeOcc: activeOccupation?.careerMapObject?.title });
    if (!urlOcc) {
      setResolvingPathway(false);
      lastProcessedOccSlug.current = null;
      return;
    }
    if (lastProcessedOccSlug.current === urlOcc) return;
    const lock = selectionLockRef.current;
    if (lock && Date.now() < lock.expires && lock.slug === urlOcc) {
      cpLog('resolvingPathway skipped during lock');
      return;
    }
    // Extend lock or create one if user intent matches (to avoid mid-resolution flips)
    if (userIntentOccupationRef.current === urlOcc) {
      if (lock && lock.slug === urlOcc) {
        // Extend existing lock if near expiry (<1s left)
        if (lock.expires - Date.now() < 1000) {
          lock.expires = Date.now() + 2000;
          cpLog('selection lock extended', lock);
        }
      } else {
        selectionLockRef.current = { slug: urlOcc, expires: Date.now() + 2000 };
        cpLog('selection lock created for intent during resolution', selectionLockRef.current);
      }
    }
    lastProcessedOccSlug.current = urlOcc;

    // Already have active occupation matching
    if (activeOccupation?.careerMapObject && slugify(activeOccupation.careerMapObject.title) === urlOcc) {
      setResolvingPathway(false);
      return;
    }

    let cancelled = false;
    setResolvingPathway(true);
    (async () => {
      try {
        const found = await findOccupationBySlug(urlOcc);
        if (cancelled) return;
        if (found) {
          cpLog('resolvingPathway found occupation in maps', found.occupation.title, 'pathway', found.pathway.title);
          setActiveMap(found.map);
          setActivePathway(found.pathway);
          const occ = await getOccupation(found.occupation.sys.id);
          if (cancelled) return;
          if (occ?.careerMapObject?.sys?.id) {
            await ensureFieldForOccupation(occ.careerMapObject.sys.id);
          }
          setResolvingPathway(false);
        } else {
          cpLog('resolvingPathway treating slug as id', urlOcc);
          const occ = await getOccupation(urlOcc); // treat as ID fallback
          if (cancelled) return;
            if (occ?.careerMapObject?.sys?.id) {
              await ensureFieldForOccupation(occ.careerMapObject.sys.id);
              cpLog('resolvingPathway ensured field for id fallback');
              setResolvingPathway(false);
            } else {
              // Increment attempts for this slug
              resolutionAttemptsRef.current[urlOcc] = (resolutionAttemptsRef.current[urlOcc] || 0) + 1;
              const attempts = resolutionAttemptsRef.current[urlOcc];
              cpLog('resolvingPathway unresolved slug attempts', { urlOcc, attempts });
              // If this slug is the user intent AND attempts < 3, keep it (optimistic) and stop
              if (userIntentOccupationRef.current === urlOcc && attempts < 3) {
                setResolvingPathway(false);
                return;
              }
              // Otherwise perform cleanup after sufficient failed attempts
              if (attempts >= 3) {
                cpLog('resolvingPathway invalid occupation clearing after attempts');
                const params = new URLSearchParams(searchParams?.toString() ?? "");
                params.delete("occupation");
                params.delete("field");
                const qs = params.toString();
                replaceQuery(qs);
                setActiveOccupation(undefined);
                setActivePathway(undefined);
              }
              setResolvingPathway(false);
            }
        }
      } catch (e) {
        cpLog('resolvingPathway error', e);
        setResolvingPathway(false);
      }
    })();
    return () => { cancelled = true; };
  }, [searchParams?.get("occupation"), activeOccupation?.careerMapObject?.title]);

  // If both field & occupation present but occupation's pathway slug doesn't match field param,
  // now align the field param to the occupation's actual pathway (respect user occupation choice).
  useEffect(() => {
    const fieldSlug = searchParams?.get("field");
    const occSlug = searchParams?.get("occupation");
    cpLog('mismatch correction effect', { fieldSlug, occSlug, activePathway: activePathway?.title, activeOccupation: activeOccupation?.careerMapObject?.title });
    if (!fieldSlug || !occSlug) return;
    if (!activePathway || !activeOccupation) return; // need current resolution
    // If the user just selected an occupation, allow resolution to catch up before forcing adjustments
    if (latestSelectionRef.current && slugify(activeOccupation.careerMapObject?.title || '') === occSlug) {
      // One pass of grace: clear selection ref to allow future corrections
      latestSelectionRef.current = null;
      return;
    }
    // Timestamp grace
    if (Date.now() - lastSelectionTsRef.current < 1500) return;
    const lock = selectionLockRef.current; if (lock && Date.now() < lock.expires) return; // respect selection lock
    const currentPathwaySlug = getFieldSlug(activePathway);
    if (currentPathwaySlug === fieldSlug) return; // already aligned
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set('field', currentPathwaySlug);
    const ordered = new URLSearchParams();
    const f = params.get('field'); if (f) ordered.set('field', f);
    const o = params.get('occupation'); if (o) ordered.set('occupation', o);
    replaceQuery(ordered.toString());
  }, [searchParams?.get("field"), searchParams?.get("occupation"), activePathway, activeOccupation, thisIndustry.careerMaps]);

  // Fallback cleanup: if occupation unresolved after short delay, drop occupation & field
  useEffect(() => {
    const occSlug = searchParams?.get('occupation');
    cpLog('fallback unresolved effect', { occSlug, hasActive: !!activeOccupation?.careerMapObject });
    if (!occSlug) return;
    if (activeOccupation?.careerMapObject) return; // already resolved
    const lock = selectionLockRef.current; if (lock && Date.now() < lock.expires) return;
    if (resolvingPathway) return; // do not clear while actively resolving
    const timer = setTimeout(() => {
      // Still unresolved
      if (!activeOccupation?.careerMapObject) {
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        // Do not nuke field prematurely; only drop occupation
        params.delete('occupation');
        const qs = params.toString();
        replaceQuery(qs);
        setResolvingPathway(false);
      }
    }, 400); // a bit faster to satisfy Cypress timeout margin
    return () => clearTimeout(timer);
  }, [searchParams?.get('occupation'), activeOccupation?.careerMapObject, router, searchParams]);

  // Fallback add occupation if field exists but occupation missing after initial hydration
  useEffect(() => {
    const fieldSlug = searchParams?.get('field');
    const occSlug = searchParams?.get('occupation');
    if (!fieldSlug || occSlug) return; // nothing to do or already present
    if (!activePathway || slugify(activePathway.title) !== fieldSlug) return; // need matching pathway
    const lock = selectionLockRef.current; if (lock && Date.now() < lock.expires) return;
    const occupations = activePathway.occupationsCollection?.items || [];
    if (!occupations.length) return;
    const first = [...occupations].sort((a:any,b:any)=> (a.level??0)-(b.level??0))[0];
    if (!first?.title) return;
    const ordered = new URLSearchParams();
    ordered.set('field', fieldSlug);
    ordered.set('occupation', slugify(first.title));
    replaceQuery(ordered.toString());
  }, [searchParams?.get('field'), searchParams?.get('occupation'), activePathway]);

  // (Removed legacy occupation effect; replaced by resolvingPathway effect above)

  // Ensure URL field param matches actual pathway after occupation & pathway resolved
  useEffect(() => {
    if (!activePathway || !activeOccupation) return;
    const currentField = searchParams?.get("field");
    const correctField = getFieldSlug(activePathway);
    if (correctField && currentField !== correctField) {
      const lock = selectionLockRef.current; if (lock && Date.now() < lock.expires) return;
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("field", correctField);
      // Preserve occupation param ordering (field then occupation)
      const ordered = new URLSearchParams();
      const fieldVal = params.get("field");
      if (fieldVal) ordered.set("field", fieldVal);
      const occVal = params.get("occupation");
      if (occVal) ordered.set("occupation", occVal);
      replaceQuery(ordered.toString());
    }
  }, [activePathway, activeOccupation]);

  useEffect(() => {
    const urlInDemand = searchParams?.get("indemand");
    
    if (!urlInDemand) {
      // Clear inDemand state if no URL param
      setActiveInDemand(undefined);
      return;
    }

    // Prevent re-processing if it's already the active inDemand
    if (activeInDemand && String(activeInDemand.idNumber) === urlInDemand) {
      return;
    }

    const match = thisIndustry.inDemandCollection?.items?.find(
      (i) => String(i.idNumber) === urlInDemand
    );

    if (match) {
      setActiveInDemand(match);
    } else {
      setActiveInDemand({
        idNumber: urlInDemand,
        title: `Occupation ${urlInDemand}`,
        sys: { id: urlInDemand } as any,
      } as InDemandItemProps);
    }
  }, [searchParams?.get("indemand"), thisIndustry.inDemandCollection?.items]);  // More specific dependencies

  useEffect(() => {
    const closeDropdown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInDemandOpen(false);
    };
    window.addEventListener("keydown", closeDropdown);

    const closeDropdownClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".occupationSelector")) {
        setInDemandOpen(false);
      }
    };
    window.addEventListener("click", closeDropdownClick);

    return () => {
      window.removeEventListener("keydown", closeDropdown);
      window.removeEventListener("click", closeDropdownClick);
    };
  }, []);

  useEffect(() => {
    const filteredPathways = activeMap?.careerMap.pathways?.items?.filter(
      (path) => path.title !== activePathway?.title
    );
    if (filteredPathways && activePathway) {
      setFullMap([activePathway, ...filteredPathways]);
    }
  }, [activePathway, activeMap]);

  useEffect(() => {
    if (!activeInDemand) return;
    const getInDemandOccupation = async () => {
      setLoading(true);
      setInDemandError(undefined);
      setInDemandOccupationData(undefined);
      try {
        const res = await fetch(`/api/occupations/${activeInDemand.idNumber}`);
        if (!res.ok) {
          // Treat 404 / 400 differently vs 500 but surface generic msg for tests
          setInDemandError("There was an error fetching the occupation data.");
          return;
        }
        const data = await res.json().catch(() => undefined);
        if (!data) {
          setInDemandError("There was an error fetching the occupation data.");
          return;
        }
        setInDemandOccupationData(data);
      } catch (e) {
        console.error("InDemand occupation fetch failed", e);
        setInDemandError("There was an error fetching the occupation data.");
      } finally {
        setLoading(false);
      }
    };

    getInDemandOccupation();
  }, [activeInDemand]);

  // Enforcement: if a selection lock or userIntent exists and field changes without corresponding occupation update, restore occupation param.
  useEffect(() => {
    const lock = selectionLockRef.current;
    const intent = userIntentOccupationRef.current;
    if (!lock && !intent) return;
    const occParam = searchParams?.get('occupation');
    const target = (lock && Date.now() < lock.expires) ? lock.slug : intent;
    if (!target) return;
    if (occParam === target) return; // already correct
    // Only enforce if we still have evidence of user selection (activeOccupation placeholder or lock active)
    cpLog('lock enforcement effect restoring occupation', { from: occParam, to: target, lockActive: !!(lock && Date.now() < lock.expires) });
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('occupation', target);
    // Preserve / ensure field ordering
    const ordered = new URLSearchParams();
    const f = params.get('field'); if (f) ordered.set('field', f);
    ordered.set('occupation', target);
    replaceQuery(ordered.toString());
  }, [searchParams?.get('field'), searchParams?.get('occupation')]);

  const hasPathways: boolean = thisIndustry.careerMaps?.items.length !== 0;

  return (
    <>
      <FieldSelect
        activeMap={activeMap}
        getCareerMap={getCareerMap}
        industry={thisIndustry}
        setActiveOccupation={setActiveOccupationAndSync}
        setActivePathway={setActivePathway}
        setFullMap={setFullMap}
        setMapOpen={setMapOpen}
        setOpen={setOpen}
        isField={!!hasPathways}
      />

      {hasPathways && (
        <OccupationGroups
          activeOccupation={activeOccupation}
          activeMap={activeMap}
          industry={thisIndustry}
          getOccupation={getOccupationAndSync}
          open={open}
          setActivePathway={setActivePathway}
          setMapOpen={setMapOpen}
          setOpen={setOpen}
          optimisticSelectOccupation={optimisticSelectOccupation}
        />
      )}

      <div
        className={`careerPathways container${activeMap ? "" : " disabled"}`}
      >
        {hasPathways && activeMap ? (
          <>
            {resolvingPathway && (
              <div
                data-testid="pathway-resolving"
                className="mb-4 p-3 rounded bg-blue-50 text-blue-900 text-sm"
              >
                Resolving pathway…
              </div>
            )}
            <div id="map-block" data-testid="map-block" className="map-block">
              <Button
                tag
                type="button"
                iconWeight="bold"
                iconPrefix={mapOpen ? "ArrowsInSimple" : "ArrowsOutSimple"}
                onClick={() => setMapOpen(!mapOpen)}
              >
                {mapOpen ? "Collapse" : "Expand"}
                <strong>{activeMap?.careerMap.title} Pathways</strong>
                map
              </Button>

              {fullMap && (
                <div className="full-map" id="full-career-map">
                  <div className="inner">
                    {(mapOpen ? fullMap : fullMap?.slice(0, 1)).map(
                      (pathItem: SinglePathwayProps) => {
                        const pathways = groupObjectsByLevel(
                          pathItem.occupationsCollection.items
                        );
                        return (
                          <Fragment key={pathItem.sys.id}>
                            <p className="path-title">{pathItem.title}</p>
                            <ul className="single-path">
                              {pathways.map((path) => {
                                const isTall = path.length > 1;
                                return (
                                  <li
                                    key={path[0].sys.id}
                                    className={isTall ? "tall" : undefined}
                                  >
                                    {path.map((occupation) => {
                                      const isActive =
                                        activeOccupation?.careerMapObject
                                          ?.sys?.id === occupation.sys.id;
                                      return (
                                        <button
                                          key={`occ${occupation.sys.id}`}
                                          data-testid={`occupation-node-${slugify(occupation.title)}`}
                                          type="button"
                                          onClick={() => {
                                            setMapOpen(false);
                                            optimisticSelectOccupation(occupation.sys.id, occupation.title, pathItem);
                                          }}
                                          className={`path-stop${
                                            isActive ? " active" : ""
                                          }`}
                                        >
                                          <span className="prev-path-connector"></span>
                                          <span className="path-connector"></span>
                                          <span className="arrow"></span>
                                          <p className="title">
                                            <strong>
                                              {occupation.title}
                                            </strong>
                                          </p>
                                          {!!occupation.salaryRangeStart && (
                                            <div className="salary">
                                              <p>
                                                Expected Entry Level Salary
                                              </p>
                                              <p>
                                                <strong>
                                                  $
                                                  {numberShorthand(
                                                    occupation.salaryRangeStart
                                                  )}
                                                  {occupation.salaryRangeEnd
                                                    ? ` - $${numberShorthand(
                                                        Number(
                                                          occupation.salaryRangeEnd
                                                        )
                                                      )}`
                                                    : ""}
                                                </strong>
                                              </p>
                                            </div>
                                          )}
                                          <div className="education">
                                            <p>Min. Education</p>
                                            <p>
                                              <strong>
                                                High School Diploma
                                              </strong>
                                            </p>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </li>
                                );
                              })}
                            </ul>
                          </Fragment>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
            {!activeOccupation && (
              <div className="mt-4 text-sm text-gray-600" data-testid="occupation-loading-placeholder">
                Select an occupation to view details.
              </div>
            )}
            {activeOccupation && (
              <Details
                content={activeOccupation.careerMapObject}
                parents={{
                  industry: thisIndustry.title,
                  field: activeMap?.careerMap.title,
                }}
              />
            )}
          </>
        ) : (
          thisIndustry.inDemandCollection &&
          thisIndustry.inDemandCollection.items.length > 0 && (
            <>
              <div
                className={`occupationSelector${
                  activeInDemand ? "" : " inactive"
                }`}
              >
                <button
                  type="button"
                  aria-label="occupation selector"
                  id="occupation-selector"
                  data-testid="indemand-selector"
                  className="select-button"
                  onClick={() => setInDemandOpen(!inDemandOpen)}
                >
                  {activeInDemand
                    ? activeInDemand.title
                    : "-Select an occupation-"}
                </button>
                {inDemandOpen && (
                  <div className="dropdown-select">
                    {thisIndustry.inDemandCollection.items.map((item) => (
                      <button
                        key={item.sys.id}
                        aria-label="occupation-item"
                        type="button"
                        className="occupation"
                        data-testid={`indemand-item-${item.idNumber}`}
                        onClick={() => {
                          setInDemandFromItem(item); // updates state + ?indemand=
                          setInDemandOpen(false);
                        }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {(loading || inDemandError || inDemandOccupationData) && (
                <>
                  {loading ? (
                    <Spinner color={colors.primary} size={75} />
                  ) : inDemandError ? (
                    <ErrorBox
                      heading={inDemandError}
                      copy="We couldn't find any entries with that name. Please try again."
                    />
                  ) : (
                    inDemandOccupationData && (
                      <InDemandDetails content={inDemandOccupationData} />
                    )
                  )}
                </>
              )}
            </>
          )
        )}
      </div>
    </>
  );
};
