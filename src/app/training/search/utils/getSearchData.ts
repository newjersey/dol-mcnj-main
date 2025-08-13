import { baking, digitalMarketing } from "../../../../mockData/index";
import { ResultProps } from "@utils/types";
import { FilterProps } from "../components/Results";
import { getZipCodesInRadius } from "@utils/getZipCodesInRadius";
import { handleFiltering } from "@utils/handleFiltering";

export async function getSearchData(props: {
  searchParams: {
    [key: string]: string;
  };
}) {
  const { searchParams } = props;

  const searchData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/search?query=${searchParams.q}`
  );

  if (!searchData.ok) {
    return {
      pageData: [],
      searchParams: "",
      searchParamsArray: [],
      itemCount: 0,
      totalPages: 0,
      pageNumber: 1,
    };
  }

  const searchParamsArray = Object.keys(searchParams)
    .filter((key) => key !== "q")
    .filter((key) => key !== "p")
    .filter((key) => key !== "sort")
    .map((key) => {
      return {
        key,
        value: searchParams[key],
      };
    });

  const contentType = searchData.headers.get("content-type");

  const searchDataItems =
    !contentType || !contentType.includes("application/json")
      ? []
      : await searchData.json();

  const mockData =
    searchParams.mockData === "baking"
      ? baking
      : searchParams.mockData === "digitalMarketing"
      ? digitalMarketing
      : undefined;

  const pageData = mockData || searchDataItems;

  let filterObject = {} as FilterProps;

  if (searchParams.inDemand) {
    filterObject = {
      ...filterObject,
      inDemand: true,
    };
  }

  if (searchParams.miles && searchParams.zip) {
    const zipCodes = getZipCodesInRadius(
      searchParams.zip,
      parseInt(searchParams.miles)
    );

    filterObject = {
      ...filterObject,
      zipCode: zipCodes,
    };
  }

  if (searchParams.county) {
    filterObject = {
      ...filterObject,
      county: searchParams.county,
    };
  }

  if (searchParams.online === "true" && searchParams.inPerson === "true") {
    // No need to filter by 'online' as both types are accepted
  } else if (searchParams.online === "true") {
    filterObject = {
      ...filterObject,
      online: "true",
    };
  } else if (searchParams.inPerson === "true") {
    filterObject = {
      ...filterObject,
      online: "false",
    };
  }

  if (searchParams.days) {
    filterObject = {
      ...filterObject,
      completionTime: filterObject.completionTime
        ? [...filterObject.completionTime, 1, 2, 3]
        : [1, 2, 3],
    };
  }

  if (searchParams.weeks) {
    filterObject = {
      ...filterObject,
      completionTime: filterObject.completionTime
        ? [...filterObject.completionTime, 4, 5]
        : [4, 5],
    };
  }

  if (searchParams.months) {
    filterObject = {
      ...filterObject,
      completionTime: filterObject.completionTime
        ? [...filterObject.completionTime, 6, 7]
        : [6, 7],
    };
  }

  if (searchParams.years) {
    filterObject = {
      ...filterObject,
      completionTime: filterObject.completionTime
        ? [...filterObject.completionTime, 8, 9, 10]
        : [8, 9, 10],
    };
  }

  if (searchParams.isWheelchairAccessible) {
    filterObject = {
      ...filterObject,
      isWheelchairAccessible: true,
    };
  }

  if (searchParams.hasChildcareAssistance) {
    filterObject = {
      ...filterObject,
      hasChildcareAssistance: true,
    };
  }

  if (searchParams.hasEveningCourses) {
    filterObject = {
      ...filterObject,
      hasEveningCourses: true,
    };
  }

  if (searchParams.hasJobPlacementAssistance) {
    filterObject = {
      ...filterObject,
      hasJobPlacementAssistance: true,
    };
  }

  if (searchParams.arabic) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Arabic"]
        : ["Arabic"],
    };
  }

  if (searchParams.chinese) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Chinese"]
        : ["Chinese"],
    };
  }

  if (searchParams.french) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "French"]
        : ["French"],
    };
  }

  if (searchParams.german) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "German"]
        : ["German"],
    };
  }

  if (searchParams.hindi) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Hindi"]
        : ["Hindi"],
    };
  }

  if (searchParams.italian) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Italian"]
        : ["Italian"],
    };
  }

  if (searchParams.japanese) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Japanese"]
        : ["Japanese"],
    };
  }

  if (searchParams.frenchCreole) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "French Creole"]
        : ["French Creole"],
    };
  }

  if (searchParams.korean) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Korean"]
        : ["Korean"],
    };
  }

  if (searchParams.polish) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Polish"]
        : ["Polish"],
    };
  }

  if (searchParams.portuguese) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Portuguese"]
        : ["Portuguese"],
    };
  }

  if (searchParams.russian) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Russian"]
        : ["Russian"],
    };
  }

  if (searchParams.spanish) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Spanish"]
        : ["Spanish"],
    };
  }

  if (searchParams.greek) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Greek"]
        : ["Greek"],
    };
  }

  if (searchParams.hebrew) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Hebrew"]
        : ["Hebrew"],
    };
  }

  if (searchParams.hindi) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Hindi"]
        : ["Hindi"],
    };
  }

  if (searchParams.vietnamese) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Vietnamese"]
        : ["Vietnamese"],
    };
  }

  if (searchParams.tagalog) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Tagalog"]
        : ["Tagalog"],
    };
  }

  if (searchParams.hungarian) {
    filterObject = {
      ...filterObject,
      languages: filterObject.languages
        ? [...filterObject.languages, "Hungarian"]
        : ["Hungarian"],
    };
  }

  if (searchParams.cipCode) {
    const removeDecimal = searchParams.cipCode.includes(".")
      ? `${searchParams.cipCode.split(".")[0]}${
          searchParams.cipCode.split(".")[1]
        }`
      : searchParams.cipCode;

    filterObject = {
      ...filterObject,
      cipCode: removeDecimal,
    };
  }

  if (searchParams.socCode) {
    if (searchParams.socCode.length === 6) {
      const socCode = `${searchParams.socCode.slice(
        0,
        2
      )}-${searchParams.socCode.slice(2)}`;
      filterObject = {
        ...filterObject,
        socCode,
      };
    } else {
      filterObject = {
        ...filterObject,
        socCode: searchParams.socCode,
      };
    }
  }

  if (searchParams.maxCost) {
    filterObject = {
      ...filterObject,
      totalCost: parseInt(searchParams.maxCost),
    };
  }

  const convertSearchParamsToUrlString = (searchParams: {
    [key: string]: string;
  }) => {
    return Object.keys(searchParams)
      .map((key) => {
        return `${key}=${searchParams[key]}`;
      })
      .join("&");
  };

  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "low":
        pageData.sort((a: ResultProps, b: ResultProps) => {
          const totalCostA = a.totalCost || 0;
          const totalCostB = b.totalCost || 0;
          return totalCostA - totalCostB;
        });
        break;
      case "high":
        pageData.sort((a: ResultProps, b: ResultProps) => {
          const totalCostA = a.totalCost || 0;
          const totalCostB = b.totalCost || 0;
          return totalCostB - totalCostA;
        });
        break;
      case "rate":
        pageData.sort((a: ResultProps, b: ResultProps) => {
          const percentEmployedA = a.percentEmployed || 0;
          const percentEmployedB = b.percentEmployed || 0;
          return percentEmployedB - percentEmployedA;
        });
        break;
      default:
        break;
    }
  }

  const pageNumber = searchParams.p ? parseInt(searchParams.p) : 1;
  const itemsPerPage = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const start = (pageNumber - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const returnedItems =
    searchParamsArray.length === 0
      ? pageData
      : handleFiltering(pageData, filterObject);

  const slicedItems = returnedItems.slice(start, end);

  return {
    pageData: slicedItems,
    searchParams: convertSearchParamsToUrlString(searchParams),
    searchParamsArray,
    itemCount: returnedItems.length,
    totalPages: Math.ceil(returnedItems.length / itemsPerPage),
    pageNumber,
  };
}
