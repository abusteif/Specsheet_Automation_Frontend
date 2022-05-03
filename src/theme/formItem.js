import React from "react";
import ReactDOM from "react-dom";

const FormItem = ({ children, style }) => {
  return (
    <div className="form-item" style={style}>
      {children}
    </div>
  );
};

export default FormItem;
