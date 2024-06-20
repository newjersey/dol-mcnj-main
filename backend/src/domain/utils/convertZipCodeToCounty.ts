import zipcodeJson from "./zip-county.json";

export const convertZipCodeToCounty = (zip: string | undefined): string => {
  if (!zip) {
    console.info("no zip found")
    return "";
  }

  const county = zipcodeJson.byZip[zip as keyof typeof zipcodeJson.byZip];

  if (!county) {
    console.info("no county found")
    return "";
  }

  return county;
};
