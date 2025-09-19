"use client";
import { useContext } from "react";
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
import { ResultsContext } from "./Results";
import { colors } from "@utils/settings";
import { X } from "@phosphor-icons/react";

const Filter = () => {
  const { setToggle, toggle } = useContext(ResultsContext);

  return (
    <FilterForm>
      <div className="overlay" />
      <p className="heading">
        <strong>Filters</strong>
        <button
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <X size={24} color={colors.base} />
        </button>
      </p>
      <div className="controls">
        <InDemand />
        <Cost />
        <County />
        <Format />
        <Distance />
        <CompletionTime />
        <Language />
        <Services />
        <CipSoc />
      </div>
      <ClearAll />
    </FilterForm>
  );
};

export { Filter };
