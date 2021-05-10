import Spinner from "react-bootstrap/Spinner";

export const textFilter = (textToDisplay) => ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      style={{
        border: "none",
        borderBottom: "1px solid lightgray",
        width: "150px",
      }}
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={textToDisplay}
    />
  );
};

export const selectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  let options = new Set();
  preFilteredRows.forEach((row) => {
    options.add(row.values[id]);
  });
  options = [...options.values()];
  return (
    <select
      style={{ width: "150px" }}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export const errorMessage = (retryFunction) => (
  <div
    style={{ fontSize: "15px", color: "blue", cursor: "pointer" }}
    onClick={retryFunction}
  >
    {`Error occurred while getting results from Jira. Click Here to try again`}
  </div>
);

export const spinner = (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Spinner animation="border" style={{ color: "navy" }} />
  </div>
);
