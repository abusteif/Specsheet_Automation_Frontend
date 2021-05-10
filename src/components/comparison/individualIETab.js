import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

import { useComparison } from "../../hooks/useComparison";
import { textFilter, selectColumnFilter } from "../../helpers/table";
import ContentTable from "./contentTable";

const IndividualIETab = ({
  mainInfo,
  secondaryInfo,
  mainError,
  mainRetry,
  secondaryError,
  secondaryRetry,
  fields,
  mainData,
  secondaryData,
  mainRATSIM,
  secondaryRATSIM,
}) => {
  const columns = useMemo(() => {
    const columns = [
      {
        Header: "Information Element",
        accessor: "headerColumn",
        Filter: textFilter("Search for IE"),
      },
      {
        Header: (
          <div className="headers">
            <div>{mainInfo.device.name}</div>
            <div>{mainInfo.iotCycle.name}</div>
            <div>{mainRATSIM ? mainRATSIM.split("_").join(" "): ""}</div>
          </div>
        ),
        accessor: "mainData",
        disableFilters: true,
      },
    ];
    if (secondaryRATSIM) {
      columns.push({
        Header: (
          <div className="headers">
            <div>{secondaryInfo.device.name}</div>
            <div>{secondaryInfo.iotCycle.name}</div>
            <div>{secondaryRATSIM.split("_").join(" ")}</div>
          </div>
        ),
        accessor: "secondaryData",
      });
    }
    if (secondaryData && Object.keys(secondaryData).length !== 0 && mainData) {
      columns.push({
        Header: "Changed / Unchanged",
        accessor: "changedUnchanged",
        Filter: selectColumnFilter,
        filter: "equals",
      });
    }
    return columns;
  }, [mainInfo, secondaryInfo, secondaryRATSIM]);

  const [prepareData] = useComparison(
    mainInfo,
    secondaryInfo,
    mainError,
    mainRetry,
    secondaryError,
    secondaryRetry,
    fields,
    mainData,
    secondaryData,
    secondaryRATSIM
  );
  const data = useMemo(() => {
    return prepareData();
  }, [secondaryInfo, mainData, secondaryData, fields, secondaryRATSIM]);

  return (
    <ContentTable
      data={data.result}
      columns={columns}
      rows={9}
      rowClass="individualIE-rows"
    />
  );
};

export default IndividualIETab;
