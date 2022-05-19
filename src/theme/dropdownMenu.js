import React, { useState, useEffect } from "react";
import SelectSearch from "react-select-search";

import fuzzySearch from "../helpers/fuzzySearch";

import "react-select-search/style.css";
import "../styling/theme/dropdownStyle.css";

const DropdownMenu = ({
  itemList,
  placeholder,
  onSelect,
  disabled,
  longItem,
  initialValue,
  resetValue,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (resetValue) setValue("");
  }, [resetValue]);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <div className={longItem ? "long-search" : ""}>
      <SelectSearch
        style={{ height: "100px" }}
        search
        disabled={disabled}
        filterOptions={fuzzySearch}
        options={itemList}
        placeholder={placeholder}
        value={value}
        onChange={(value) => {
          onSelect(value);
          setValue(value);
        }}
      />
    </div>
  );
};

export default DropdownMenu;
