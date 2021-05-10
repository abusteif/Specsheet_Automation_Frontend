import React from "react";
import ReactDOM from "react-dom";

import "../styling/theme/keyValueLine.css";
const KeyValueLine = ({ keyProp, valueProp }) => {
  return (
    <div className="individual-line">
      <span className="individual-line-left-half">{`${keyProp}:`}</span>
      <span className="individual-line-right-half">
        {valueProp && `${valueProp}`}
      </span>
    </div>
  );
};

export default KeyValueLine;
