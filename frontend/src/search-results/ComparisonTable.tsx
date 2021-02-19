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
      col1: props.data[0]?.percentEmployed
        ? formatPercentEmployed(props.data[0].percentEmployed)
        : "--",
      col2: props.data[1]?.percentEmployed
        ? formatPercentEmployed(props.data[1].percentEmployed)
        : "--",
      col3: props.data[2]?.percentEmployed
        ? formatPercentEmployed(props.data[2].percentEmployed)
        : "--",
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
        <LinkButton to={`/training/${props.data[0].id}`}>See Details</LinkButton>
      ),
      col2: props.data[1] && (
        <LinkButton to={`/training/${props.data[1].id}`}>See Details</LinkButton>
      ),
      col3: props.data[2] && (
        <LinkButton to={`/training/${props.data[2].id}`}>See Details</LinkButton>
      ),
    },
  ];

  const table = (
    <Table className="comparison-table">
      <TableBody>
        {row.map((row, key) => {
          return (
            <>
              {row.heading && (
                <TableRow className="table-row" key={`trh-${key}`}>
                  <TableCell component="th" className="table-header" key="th1">
                    {row.heading}
                  </TableCell>
                  <TableCell component="th" className="table-header" key="th2" />
                  <TableCell component="th" className="table-header" key="th3" />
                </TableRow>
              )}
              <TableRow key={`trc-${key}`}>
                {row.col1 && (
                  <TableCell className="table-cell" key="tr1">
                    {row.col1}
                  </TableCell>
                )}
                {row.col2 && (
                  <TableCell className="table-cell" key="tr2">
                    {row.col2}
                  </TableCell>
                )}
                {row.col3 && (
                  <TableCell className="table-cell" key="tr3">
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
