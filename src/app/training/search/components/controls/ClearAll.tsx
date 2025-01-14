import { Button } from "@components/modules/Button";
import { extractParam } from "../../utils/filterFunctions";
import { useContext } from "react";
import { ResultsContext } from "../Results";

export const ClearAll = () => {
  let { results, setToggle } = useContext(ResultsContext);
  return (
    <div className="section search">
      <Button
        type="button"
        defaultStyle="secondary"
        label="Apply"
        onClick={() => {
          setToggle(false);
        }}
      />
      <Button
        type="button"
        defaultStyle="secondary"
        outlined
        label="Clear Filters"
        onClick={() => {
          window.location.href = `/training/search?q=${extractParam(
            "q",
            results
          )}`;
        }}
      />
    </div>
  );
};
