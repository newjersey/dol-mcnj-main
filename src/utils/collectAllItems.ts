export type Option = { label: string; value: string };

export function collectAllItems(data: any) {
  const map = new Map<string, Option>();

  data.industryCollection?.items?.forEach((industry: any) => {
    // In-demand items
    industry.inDemandCollection?.items?.forEach((item: any) => {
      if (item?.title && item?.idNumber) {
        map.set(item.idNumber, {
          label: item.title,
          value: `${industry.slug}?indemand=${item.idNumber}`,
        });
      }
    });

    // Nested occupation items
    industry.mapsCollection?.items?.forEach((mapItem: any) => {
      mapItem.pathwaysCollection?.items?.forEach((pathway: any) => {
        pathway.occupationsCollection?.items?.forEach((occ: any) => {
          if (occ?.title && occ?.sys?.id) {
            map.set(occ.sys.id, {
              label: occ.title,
              value: `${industry.slug}?occupation=${occ.sys.id}`,
            });
          }
        });
      });
    });
  });

  return Array.from(map.values());
}

export function collectAllItemsNormalized(data: any): Option[] {
  const map = new Map<string, Option>(); // dedupe by value

  data?.industryCollection?.items?.forEach((industry: any) => {
    // in-demand
    industry?.inDemandCollection?.items?.forEach((item: any) => {
      if (item?.title && item?.idNumber) {
        map.set(item.idNumber, {
          label: item.title,
          value: `${industry.slug}?indemand=${item.idNumber}`,
        });
      }
    });

    // nested occupations
    industry?.mapsCollection?.items?.forEach((m: any) => {
      m?.pathwaysCollection?.items?.forEach((p: any) => {
        p?.occupationsCollection?.items?.forEach((occ: any) => {
          if (occ?.title && occ?.sys?.id) {
            map.set(occ.sys.id, {
              label: occ.title,
              value: `${industry.slug}?occupation=${occ.sys.id}`,
            });
          }
        });
      });
    });
  });

  // optional: sort alphabetically by label
  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  );
}
