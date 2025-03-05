"use client";
import { useContext, useState } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { FormInput } from "@components/modules/FormInput";
import { getSearchData } from "../../utils/getSearchData";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { camelify } from "@utils/slugify";
import { allLanguages } from "@utils/languages";

export const Language = () => {
  let { results, setResults } = useContext(ResultsContext);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="section language">
      <p className="label">Filter by Language</p>
      <div className="items">
        {allLanguages.map((lang, index) => (
          <FormInput
            key={lang}
            type="checkbox"
            className={showMore ? undefined : index > 3 ? "hide" : undefined}
            inputId={lang}
            label={lang}
            defaultChecked={extractParam(camelify(lang), results) === "true"}
            onChange={(e) => {
              updateSearchParamsNavigate(
                [
                  {
                    key: camelify(lang),
                    value: e.target.checked.toString(),
                  },
                  { key: "p", value: "1" },
                ],
                getSearchData,
                setResults
              );
            }}
          />
        ))}
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setShowMore(!showMore);
        }}
      >
        {showMore ? <CaretUp size={20} /> : <CaretDown size={20} />}
        Show {showMore ? "less" : "more"}
      </a>
    </div>
  );
};
