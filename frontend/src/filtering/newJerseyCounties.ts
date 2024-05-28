export const COUNTIES = [
  "Atlantic",
  "Bergen",
  "Burlington",
  "Camden",
  "Cape May",
  "Cumberland",
  "Essex",
  "Gloucester",
  "Hudson",
  "Hunterdon",
  "Mercer",
  "Middlesex",
  "Monmouth",
  "Morris",
  "Ocean",
  "Passaic",
  "Salem",
  "Somerset",
  "Sussex",
  "Union",
  "Warren",
];

export type CountyProps =  "Atlantic" | "Bergen" | "Burlington" | "Camden" | "Cape May" | "Cumberland" | "Essex" | "Gloucester" | "Hudson" | "Hunterdon" | "Mercer" | "Middlesex" | "Monmouth" | "Morris" | "Ocean" | "Passaic" | "Salem" | "Somerset" | "Sussex" | "Union" | "Warren";

export const getCountyName = (county: string): string =>
  county.substring(0, county.lastIndexOf(" "));
