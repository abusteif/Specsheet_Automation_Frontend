import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import AppHeader from "../components/appHeader";

import "../styling/appBody.css";
import "../styling/commonStyles.css";

const Screen = (props) => {
  return (
    <div className="page">
      <AppHeader subMessage={props.subMessage} />
      <div className="body-main" style={{ ...props.style }}>
        {props.children}
      </div>
    </div>
  );
};

export default Screen;
