"use client";
import { Button } from "@components/modules/Button";
import { Tag } from "@components/modules/Tag";
import { X } from "@phosphor-icons/react";
import { calendarLength } from "@utils/calendarLength";
import { toUsCurrency } from "@utils/toUsCurrency";
import { ResultProps } from "@utils/types";
import { useContext, useState } from "react";
import { ResultsContext } from "./Results";

export const CompareTable = () => {
  let { compare, setCompare } = useContext(ResultsContext);

  const [expanded, setExpanded] = useState<boolean>(false);
  const remainingBoxes = 3 - compare.length;

  const remainingBoxesArray = Array.from(Array(remainingBoxes).keys());

  return (
    <div className="compareTable">
      <div className="compare-inner">
        {expanded ? (
          <div className="usa-table">
            <table>
              <thead>
                <tr>
                  <td></td>
                  {compare.map((item) => (
                    <td key={item.id}>
                      <div>
                        <p>{item.name}</p>
                        <p>{item.providerName}</p>
                        {item.inDemand && (
                          <Tag
                            color="orange"
                            iconWeight="fill"
                            icon="Fire"
                            chip
                            title="In Demand"
                          />
                        )}
                      </div>
                    </td>
                  ))}
                  {remainingBoxesArray.map((item) => (
                    <td key={`emptyTablehead${item}`}></td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cost</td>
                  {compare.map((item) => (
                    <td key={item.id}>
                      {item.totalCost ? toUsCurrency(item.totalCost) : "--"}
                    </td>
                  ))}
                  {remainingBoxesArray.map((item) => (
                    <td key={`emptyTablebox${item}`}></td>
                  ))}
                </tr>
                <tr>
                  <td>Employment Rate %</td>
                  {compare.map((item) => (
                    <td key={item.id}>
                      {" "}
                      {item.percentEmployed
                        ? `${Math.round(item.percentEmployed * 100)}% Employed`
                        : "--"}
                    </td>
                  ))}
                  {remainingBoxesArray.map((item) => (
                    <td key={`emptyTablebox2${item}`}></td>
                  ))}
                </tr>
                <tr>
                  <td>Time to Complete</td>
                  {compare.map((item) => (
                    <td key={item.id}>
                      {item.calendarLength
                        ? calendarLength(item.calendarLength)
                        : "--"}
                    </td>
                  ))}
                  {remainingBoxesArray.map((item) => (
                    <td key={`emptyTablebox3${item}`}></td>
                  ))}
                </tr>
                <tr>
                  <td></td>
                  {compare.map((item) => (
                    <td key={item.id}>
                      <Button type="link" link={`/training/${item.id}`}>
                        See Details
                      </Button>
                    </td>
                  ))}
                  {remainingBoxesArray.map((item) => (
                    <td key={`emptyTablebox4${item}`}></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="boxes">
            {compare.map((item) => (
              <div className="box" key={item.id}>
                <p>{item.name}</p>
                <p>{item.providerName}</p>
                <button
                  type="button"
                  onClick={() => {
                    // find the div with id of item.id and uncheck the checkbox
                    const checkbox: HTMLInputElement = document.getElementById(
                      `checkbox_${item.id}`
                    ) as HTMLInputElement;
                    checkbox.checked = false;

                    setCompare(
                      compare.filter(
                        (compareItem) => compareItem.id !== item.id
                      )
                    );
                  }}
                >
                  <X color="#fff" weight="bold" size={12} />
                </button>
              </div>
            ))}
            {remainingBoxesArray.map((item) => (
              <div className="box empty" key={item}></div>
            ))}
          </div>
        )}
        <div className="buttons">
          <Button
            type="button"
            defaultStyle="secondary"
            outlined
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Collapse" : "Compare"}
          </Button>
          <Button
            type="button"
            defaultStyle="secondary"
            outlined
            onClick={() => {
              setCompare([]);
              // find all the checkboxes .resultCard checkbox and uncheck them
              const checkboxes: NodeListOf<HTMLInputElement> =
                document.querySelectorAll('.resultCard input[type="checkbox"]');
              checkboxes.forEach((checkbox: HTMLInputElement) => {
                checkbox.checked = false;
              });
            }}
          >
            Clear all
          </Button>
        </div>
      </div>
    </div>
  );
};
