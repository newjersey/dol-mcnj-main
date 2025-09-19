import { FilterProps } from "app/training/search/components/Results";
import { ResultProps } from "./types";

export function handleFiltering(
  items: ResultProps[],
  filterObject?: FilterProps,
): ResultProps[] {
  if (!filterObject) return items;

  return items.filter((item) => {
    let isMatch = true;

    if (filterObject.zipCode && filterObject.zipCode.length > 0) {
      isMatch = isMatch && filterObject.zipCode.includes(item.zipCode);
    }

    if (filterObject.county) {
      isMatch = isMatch && item.county === filterObject.county;
    }

    if (filterObject.inDemand !== undefined) {
      isMatch = isMatch && item.inDemand === filterObject.inDemand;
    }

    if (filterObject.totalCost !== undefined) {
      isMatch =
        isMatch &&
        item.totalCost !== undefined &&
        item.totalCost <= filterObject.totalCost;
    }

    if (filterObject.cipCode) {
      isMatch = isMatch && item.cipDefinition?.cipcode === filterObject.cipCode;
    }

    if (filterObject.online !== undefined) {
      const isOnline = filterObject.online === "true";
      isMatch = isMatch && item.online === isOnline;
    }

    if (filterObject.completionTime && filterObject.completionTime.length > 0) {
      isMatch =
        isMatch &&
        item.calendarLength !== undefined &&
        filterObject.completionTime.includes(item.calendarLength);
    }

    if (filterObject.isWheelchairAccessible !== undefined) {
      isMatch =
        isMatch &&
        item.isWheelchairAccessible === filterObject.isWheelchairAccessible;
    }

    if (filterObject.hasJobPlacementAssistance !== undefined) {
      isMatch =
        isMatch &&
        item.hasJobPlacementAssistance ===
          filterObject.hasJobPlacementAssistance;
    }

    if (filterObject.hasChildcareAssistance !== undefined) {
      isMatch =
        isMatch &&
        item.hasChildcareAssistance === filterObject.hasChildcareAssistance;
    }

    if (filterObject.hasEveningCourses !== undefined) {
      isMatch =
        isMatch && item.hasEveningCourses === filterObject.hasEveningCourses;
    }

    if (filterObject.languages && filterObject.languages.length > 0) {
      isMatch =
        isMatch &&
        item.languages !== undefined &&
        filterObject.languages.some((language) =>
          item.languages?.includes(language),
        );
    }

    if (filterObject.socCode) {
      isMatch =
        isMatch &&
        item.socCodes !== undefined &&
        item.socCodes.includes(filterObject.socCode);
    }

    return isMatch;
  });
}
