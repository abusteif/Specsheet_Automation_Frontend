import React from "react";
import ReactDOM from "react-dom";

import "../styling/theme/keyValueLine.css";
const KeyValueLine = ({ keyProp, valueProp, keyColor, valueColor }) => {
  let keyStyle = keyColor ? { color: keyColor } : {};
  let valueStyle = valueColor ? { color: valueColor } : {};
  return (
    <div className="individual-line">
      <span
        className="individual-line-left-half"
        style={keyStyle}
      >{`${keyProp}:`}</span>
      <span className="individual-line-right-half" style={valueStyle}>
        {valueProp && `${valueProp}`}
      </span>
    </div>
  );
};

export default KeyValueLine;
