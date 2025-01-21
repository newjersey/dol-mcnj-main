"use client";
import { useContext } from "react";
import {
  extractParam,
  updateSearchParamsNavigate,
} from "../../utils/filterFunctions";
import { ResultsContext } from "../Results";
import { getSearchData } from "../../utils/getSearchData";
import { Switch } from "@components/modules/Switch";

export const Services = () => {
  let { results, setResults } = useContext(ResultsContext);

  return (
    <div className="section services">
      <p className="label">Filter by Provider Services</p>

      <Switch
        inputId="wheelchair-accessible"
        defaultChecked={
          extractParam("isWheelchairAccessible", results) === "true"
        }
        label="Wheelchair Accessible"
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              {
                key: "isWheelchairAccessible",
                value: e.target.checked.toString(),
              },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      />
      <Switch
        inputId="childcare-assistance"
        label="Childcare Assistance"
        defaultChecked={
          extractParam("hasChildcareAssistance", results) === "true"
        }
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              {
                key: "hasChildcareAssistance",
                value: e.target.checked.toString(),
              },
            ],
            getSearchData,
            setResults
          );
        }}
      />
      <Switch
        inputId="offer-evening-courses"
        label="Offer Evening Courses"
        defaultChecked={extractParam("hasEveningCourses", results) === "true"}
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              {
                key: "hasEveningCourses",
                value: e.target.checked.toString(),
              },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      />
      <Switch
        inputId="job-placement-assistance"
        label="Job Placement Assistance"
        defaultChecked={
          extractParam("hasJobPlacementAssistance", results) === "true"
        }
        onChange={(e) => {
          updateSearchParamsNavigate(
            [
              {
                key: "hasJobPlacementAssistance",
                value: e.target.checked.toString(),
              },
              { key: "p", value: "1" },
            ],
            getSearchData,
            setResults
          );
        }}
      />
    </div>
  );
};
