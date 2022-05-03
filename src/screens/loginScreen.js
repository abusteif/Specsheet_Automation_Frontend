import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import Button from "react-bootstrap/Button";

import Screen from "./screenTemplate";
import TextInputField from "../theme/textInputField";
import "../styling/loginScreen.css";
import { initialiseJira } from "../actions/jira-actions";
import { apiErrorMessage, jiraProjectKey } from "../configs/staticData";
import { getProjectId, login } from "../actions/common-actions";
import {
  LOGGEDIN,
  LOGGEDOUT,
  ERROR,
  LOGGINGIN,
} from "../configs/configurations";

const LoginScreen = (props) => {
  const [user, setUser] = useState("");

  return (
    <Screen
      subMessage={
        !props.common.status && apiErrorMessage + props.common.errorMessage
      }
      loadingOverlayActive={
        !props.jira.projectId || props.common.loginStatus === LOGGINGIN
          ? true
          : false
      }
      spinnerText={
        props.common.loginStatus === LOGGINGIN ? "Logging you in" : ""
      }
    >
      <div className="login-screen-main">
        <span className="item-selection-headings">Enter your d-number</span>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextInputField
            onKeyPress={(e, text) => {
              if (e.code == "Enter" && text) {
                setUser(text);
                props.login(user);
              }
            }}
            placeholder={"eg. d12312"}
            className="jira-password-input"
            onRead={setUser}
            disabled={false}
            initialValue={""}
          />
          <Button
            variant={"primary"}
            size="md"
            key={"discard"}
            disabled={!user}
            onClick={() => {
              props.login(user);
            }}
          >
            {"Login"}
          </Button>
        </div>
        {props.common.loginStatus === ERROR && (
          <span className="login-error-message">
            An error occured while trying to login. Please check d number and
            try again.
          </span>
        )}
      </div>
    </Screen>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    common: state.common,
    jira: state.jira,
  };
};
export default connect(mapStateToProps, {
  getProjectId,
  initialiseJira,
  login,
})(LoginScreen);
