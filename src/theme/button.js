import React from "react";
import ReactDOM from "react-dom";

import "../styling/theme/button.css";

const Button = ({ height, width, color, onClick, children, className }) => {
  return (
    <div className={`glossy-button ${className}`} style={{ height, width }}>
      {children}
    </div>
  );
};

export default Button;
