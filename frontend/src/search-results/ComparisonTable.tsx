import React, { ReactElement } from "react";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { TrainingResult } from "../domain/Training";
import { formatMoney } from "accounting";
import { formatPercentEmployed } from "../presenters/formatPercentEmployed";
import { CalendarLengthLookup } from "../localizations/CalendarLengthLookup";
import { InDemandTag } from "../components/InDemandTag";
import { LinkButton } from "../components/LinkButton";

interface Props {
  headings?: string[];
  data: TrainingResult[];
  wide?: boolean;
  className?: string;
}

export const ComparisonTable = (props: Props): ReactElement => {
  const row = [
    {
      heading: "Training Title",
      col1: props.data[0]?.name,
      col2: props.data[1]?.name,
      col3: props.data[2]?.name,
    },
    {
      heading: "Training Provider",
      col1: props.data[0]?.providerName,
      col2: props.data[1]?.providerName,
      col3: props.data[2]?.providerName,
    },
    {
      heading: "Cost",
      col1: props.data[0] && formatMoney(props.data[0].totalCost),
      col2: props.data[1] && formatMoney(props.data[1].totalCost),
      col3: props.data[2] && formatMoney(props.data[2].totalCost),
    },
    {
      heading: "Employment Rate",
      col1: props.data[0]
        ? props.data[0].percentEmployed
          ? formatPercentEmployed(props.data[0].percentEmployed)
          : "--"
        : null,
      col2: props.data[1]
        ? props.data[1].percentEmployed
          ? formatPercentEmployed(props.data[1].percentEmployed)
          : "--"
        : null,
      col3: props.data[2]
        ? props.data[2].percentEmployed
          ? formatPercentEmployed(props.data[2].percentEmployed)
          : "--"
        : null,
    },
    {
      heading: "Time to Complete",
      col1: CalendarLengthLookup[props.data[0]?.calendarLength],
      col2: CalendarLengthLookup[props.data[1]?.calendarLength],
      col3: CalendarLengthLookup[props.data[2]?.calendarLength],
    },
    {
      heading: "",
      col1: props.data[0]?.inDemand && <InDemandTag />,
      col2: props.data[1]?.inDemand && <InDemandTag />,
      col3: props.data[2]?.inDemand && <InDemandTag />,
    },
    {
      heading: "",
      col1: props.data[0] && (
        <LinkButton className=" table-button" to={`/training/${props.data[0].id}`}>
          See Details
        </LinkButton>
      ),
      col2: props.data[1] && (
        <LinkButton className=" table-button" to={`/training/${props.data[1].id}`}>
          See Details
        </LinkButton>
      ),
      col3: props.data[2] && (
        <LinkButton className=" table-button" to={`/training/${props.data[2].id}`}>
          See Details
        </LinkButton>
      ),
      class: "cell-bottom",
    },
  ];

  const table = (
    <Table className={`comparison-table ${props.wide && "wide"} ${props.className}`}>
      <TableBody>
        {row.map((row, key) => {
          return (
            <>
              {row.heading && (
                <TableRow className="table-row" key={`trh-${key}`}>
                  {row.heading && (
                    <TableCell
                      component="th"
                      className="table-header"
                      colSpan={3}
                      key={`th1-${key}`}
                    >
                      {row.heading}
                    </TableCell>
                  )}
                </TableRow>
              )}
              <TableRow key={`trc-${key}`}>
                {row.col1 && (
                  <TableCell className={`table-cell ${row.class}`} key={`tr1-${key}`}>
                    {row.col1}
                  </TableCell>
                )}
                {row.col2 && (
                  <TableCell className={`table-cell ${row.class}`} key={`tr2-${key}`}>
                    {row.col2}
                  </TableCell>
                )}
                {row.col3 && (
                  <TableCell className={`table-cell ${row.class}`} key={`tr3-${key}`}>
                    {row.col3}
                  </TableCell>
                )}
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </Table>
  );

  return table;
};
