import React, { useMemo, useState, useEffect } from "react";
import BTable from "react-bootstrap/Table";

import { useTable, usePagination, useFilters } from "react-table";

import { textFilter } from "../../helpers/table";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../styling/theme/table.css";

const ContentTable = ({ columns, data, rows, rowClass }) => {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: <></>,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn,
    },
    useFilters,
    usePagination
  );
  useEffect(() => {
    setPageSize(rows || 6);
  }, []);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={rowClass}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {pageOptions.length > 0 ? (
        <div className="pagination">
          <div>
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {"<<     "}
            </button>{" "}
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="pagination-button"
            >
              {"<"}
            </button>{" "}
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {">"}
            </button>{" "}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="pagination-button"
            >
              {">>"}
            </button>{" "}
          </div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
        </div>
      ) : null}
    </>
  );
};

export default ContentTable;
