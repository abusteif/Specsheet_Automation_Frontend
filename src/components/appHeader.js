import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import "../styling/appHeader.css";
import "../styling/commonStyles.css";

const AppHeader = (props) => {
  return (
    <div className="header-main border-shadow-bottom">
      <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
        <div className="header-text">WDA Automation And Reporting</div>
      </Link>
      {props.subMessage && <div className="error-text">{props.subMessage}</div>}
    </div>
  );
};

export default AppHeader;
