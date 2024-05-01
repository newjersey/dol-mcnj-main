import zipcodeJson from "./zip-county.json";

export const convertZipCodeToCounty = (zip: string | undefined): string => {
  if (!zip) {
    console.log("no zip found")
    return "";
  }

  const county = zipcodeJson.byZip[zip as keyof typeof zipcodeJson.byZip];

  if (!county) {
    console.log("no county found")
    return "";
  }

  return county;
};
