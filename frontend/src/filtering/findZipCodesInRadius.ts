import { zipCodeToCoordinates } from "./zipCodeCoordinates";

export const getZipCodesInRadius = (zipCode: string, radiusInMiles: number): string[] => {
  if (!(zipCode in zipCodeToCoordinates)) return [];

  const fromCoordinates = zipCodeToCoordinates[zipCode];

  return Object.keys(zipCodeToCoordinates).filter((toZipCode) => {
    const toCoordinates = zipCodeToCoordinates[toZipCode];
    const distance = getDistanceBetweenPoints(fromCoordinates, toCoordinates);
    return distance <= radiusInMiles;
  });
};

// Reference: https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
const getDistanceBetweenPoints = (
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number],
  isMiles = true
): number => {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;
  const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);
  const RADIUS_OF_EARTH_IN_KM = 6371;

  const dLat = distance(lat2, lat1);
  const dLon = distance(lon2, lon1);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  // Haversine Formula
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

  if (isMiles) {
    finalDistance /= 1.60934;
  }

  return finalDistance;
};
