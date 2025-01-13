import {
  CipSoc,
  ClearAll,
  CompletionTime,
  Cost,
  County,
  Distance,
  FilterForm,
  Format,
  InDemand,
  Language,
  Services,
} from "./controls";
const Filter = () => {
  return (
    <FilterForm>
      <InDemand />
      <Cost />
      <County />
      <Format />
      <Distance />
      <CompletionTime />
      <Language />
      <Services />
      <CipSoc />
      <ClearAll />
    </FilterForm>
  );
};

export { Filter };
