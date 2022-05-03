import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import KeyValueLine from "../theme/keyValueLine";

import "../styling/appHeader.css";
import "../styling/commonStyles.css";

const AppHeader = ({ subMessage, login, logout }) => {
  return (
    <div className="header-main border-shadow-bottom">
      <div className="header-container">
        <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
          <div className="header-text">WDA Automation And Reporting</div>
        </Link>
        {login && (
          <div
            style={{
              alignSelf: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <KeyValueLine
              keyProp="Logged in as"
              valueProp={login.displayName}
            />
            <span
              onClick={logout}
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                fontSize: "15px",
                fontStyle: "italic",
                cursor: "pointer",
                color: "blue",
              }}
            >
              (Log out)
            </span>
          </div>
        )}
      </div>
      {subMessage && <div className="error-text">{subMessage}</div>}
    </div>
  );
};

export default AppHeader;
