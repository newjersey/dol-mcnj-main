import zipcodeJson from "./zip-county.json";
import { convertZipCodeToCounty } from "./convertZipCodeToCounty";

describe('convertZipCodeToCounty', () => {
  it('should return the correct county for a zip code', () => {
    const keys = Object.keys(zipcodeJson.byZip);
    let randomZip = keys[Math.floor(Math.random() * keys.length)];
    let county = zipcodeJson.byZip[randomZip as keyof typeof zipcodeJson.byZip]
    expect(convertZipCodeToCounty(randomZip)).toEqual(county);
    randomZip = keys[Math.floor(Math.random() * keys.length)];
    county = zipcodeJson.byZip[randomZip as keyof typeof zipcodeJson.byZip]
    expect(convertZipCodeToCounty(randomZip)).toEqual(county);
    randomZip = keys[Math.floor(Math.random() * keys.length)];
    county = zipcodeJson.byZip[randomZip as keyof typeof zipcodeJson.byZip]
    expect(convertZipCodeToCounty(randomZip)).toEqual(county);
  });
});
