"use client";
import { SectionHeading } from "@components/modules/SectionHeading";
import { Path } from "@phosphor-icons/react";
import {
  CareerMapProps,
  IndustryProps,
  OccupationNodeProps,
} from "@utils/types";
import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { slugify } from "@utils/slugify";

interface OccupationGroupsProps {
  activeMap?: CareerMapProps;
  industry: IndustryProps;
  setMapOpen: (open: boolean) => void;
  setOpen: (open: boolean) => void;
  activeOccupation?: {
    careerMapObject: OccupationNodeProps;
  };
  setActivePathway: (pathway: any) => void;
  getOccupation: (id: string) => void;
  open?: boolean;
  // Optional optimistic selector (id, title, pathway) to immediately set URL params
  optimisticSelectOccupation?: (id: string, title: string, pathway: any) => void;
}

export const OccupationGroups = ({
  activeMap,
  industry,
  setMapOpen,
  activeOccupation,
  setOpen,
  setActivePathway,
  getOccupation,
  open,
  optimisticSelectOccupation,
}: OccupationGroupsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    const closeDropdown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", closeDropdown);

    const closeDropdownClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".select")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", closeDropdownClick);
  }, []);

  return (
    <div
      id="occupationGroups"
      className={`occupationGroups${activeMap ? "" : " disabled"}`}
    >
      <div className="container">
        <div className="groups">
          <SectionHeading
            headingLevel={4}
            noDivider
            heading={
              activeMap
                ? `Select a ${activeMap.careerMap.title} occupation`
                : "Select an occupation"
            }
          />

          <div className="select">
            {activeMap ? "" : `Select a ${industry.title} field above first`}
            <button
              type="button"
              disabled={!activeMap}
              className="select-button"
              aria-label="occupationSelector"
              id="occupationSelector"
              onClick={() => {
                setMapOpen(false);
                setOpen(!open);
              }}
            >
              {activeOccupation
                ? activeOccupation.careerMapObject.title
                : `-Select an occupation-`}
            </button>
            {open && (
              <div className="dropdown-select">
                {activeMap?.careerMap.pathways?.items.map((path) => (
                  <div key={path.sys.id}>
                    <p className="path-title">
                      <Path size={32} />
                      {path.title}
                    </p>
                    {path.occupationsCollection.items.map((occupation) => (
                      <button
                        key={occupation.sys.id}
                        aria-label="occupation-item"
                        type="button"
                        className="occupation"
                        onClick={() => {
                          setOpen(false);
                          setMapOpen(false);
                          setActivePathway(path);
                          if ((window as any)?.__CP_DEBUG__) {
                            console.log('[CP] OccupationGroups select click', occupation.title, 'pathway', path.title, 'optimistic', !!optimisticSelectOccupation);
                          }
                          if (optimisticSelectOccupation) {
                            optimisticSelectOccupation(occupation.sys.id, occupation.title, path);
                          } else {
                            // Fallback manual optimistic URL update when upstream handler not provided
                            try {
                              const params = new URLSearchParams(searchParams?.toString() ?? '');
                              params.set('field', slugify(path.title));
                              params.set('occupation', slugify(occupation.title));
                              // order (field then occupation)
                              const ordered = new URLSearchParams();
                              const f = params.get('field'); if (f) ordered.set('field', f);
                              const o = params.get('occupation'); if (o) ordered.set('occupation', o);
                              const qs = ordered.toString();
                              router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
                              if ((window as any)?.__CP_DEBUG__) {
                                console.log('[CP] OccupationGroups fallback optimistic URL', qs);
                              }
                            } catch {/* silent */}
                            getOccupation(occupation.sys.id);
                          }
                          setTimeout(() => {
                            const element =
                              document.getElementById("map-block");
                            if (element) {
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }, 100);
                        }}
                      >
                        {occupation.title}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
