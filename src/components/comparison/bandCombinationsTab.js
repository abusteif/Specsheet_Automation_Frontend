import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

import { useBandCombinationComparison } from "../../hooks/useBandCombinationComparison";
import { textFilter, selectColumnFilter } from "../../helpers/table";

import ContentTable from "./contentTable";

const BandCombinationsTab = ({
  mainInfo,
  secondaryInfo,
  mainError,
  mainRetry,
  secondaryError,
  secondaryRetry,
  mainData,
  secondaryData,
  secondaryRATSIM,
}) => {
  const columns = useMemo(() => {
    const columns = [
      {
        Header: "Uplink",
        accessor: "ulBands",
        Filter: selectColumnFilter,
        filter: "equals",
      },
      {
        Header: "Band Combination",
        accessor: "dlBands",
        Filter: textFilter("Type to search"),
      },
      {
        Header: "BCS",
        accessor: "bcs",
      },
      {
        Header: "DL Carriers",
        accessor: "dlCarriers",
        Filter: selectColumnFilter,
        filter: "equals",
      },
      {
        Header: "UL Carriers",
        accessor: "ulCarriers",
        Filter: selectColumnFilter,
        filter: "equals",
      },
      {
        Header: "DL Layers",
        accessor: "dlLayers",
        Filter: selectColumnFilter,
        filter: "equals",
      },
    ];

    if (mainData) {
      columns.push({
        Header: "Status",
        accessor: "status",
        Filter: selectColumnFilter,
        filter: "equals",
      });
    }
    return columns;
  }, [mainData, secondaryRATSIM]);

  const [prepareData] = useBandCombinationComparison(
    mainInfo,
    secondaryInfo,
    mainError,
    mainRetry,
    secondaryError,
    secondaryRetry,
    mainData,
    secondaryData,
    columns,
    secondaryRATSIM
  );
  const data = useMemo(() => {
    return prepareData();
  }, [secondaryInfo, mainData, secondaryData, secondaryRATSIM]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ flex: 1 }}>
        <ContentTable
          data={data.result}
          columns={columns}
          rows={15}
          rowClass="band-combination-rows"
        />
      </div>
      {
        // <div className="summary-section">summary:</div>
      }
    </div>
  );
};

export default BandCombinationsTab;
