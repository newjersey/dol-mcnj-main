export const COUNTIES = [
  "Atlantic County",
  "Bergen County",
  "Burlington County",
  "Camden County",
  "Cape May County",
  "Cumberland County",
  "Essex County",
  "Gloucester County",
  "Hudson County",
  "Hunterdon County",
  "Mercer County",
  "Middlesex County",
  "Monmouth County",
  "Morris County",
  "Ocean County",
  "Passaic County",
  "Salem County",
  "Somerset County",
  "Sussex County",
  "Union County",
  "Warren County",
];

export const getCountyName = (county: string): string =>
  county.substring(0, county.lastIndexOf(" "));
