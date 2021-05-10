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
  initialValue,
  resetValue,
}) => {
  const [value, setValue] = useState(initialValue);
  return (
    <SelectSearch
      search
      disabled={disabled}
      filterOptions={fuzzySearch}
      options={itemList}
      placeholder={placeholder}
      value={resetValue ? "" : value}
      onChange={(value) => {
        onSelect(value);
        setValue(value);
      }}
    />
  );
};

export default DropdownMenu;
