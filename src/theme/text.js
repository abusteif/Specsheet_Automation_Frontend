import React from "react";
import ReactDOM from "react-dom";

import "../styling/theme/text.css";

const Text = ({ text }) => {
  return <div className="text">{text}</div>;
};

export default Text;
