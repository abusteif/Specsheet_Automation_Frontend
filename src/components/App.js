import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import history from "../history";

import { getProjectId, generateCookies } from "../actions/common-actions";

import HomeScreen from "../screens/homeScreen";
import ReportingScreen from "../screens/reportingScreen";
import AutomationScreen from "../screens/automationScreen";
import ComparisonScreen from "../screens/comparisonScreen";

import "../styling/homeScreen.css";
import "../styling/app.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { apiErrorMessage, projectKey } from "../configs/staticData";
const App = (props) => {
  useEffect(() => {
    props.generateCookies();
  }, []);
  useEffect(() => {
    if (props.common.token) props.getProjectId(projectKey);
  }, [props.common.token]);

  return (
    <Router history={history}>
      <div className="home-screen">
        <Switch>
          {
            // <Route path="/" exact component={HomeScreen} />
            <Route path="/" exact component={AutomationScreen} />
          }
          <Route path="/reporting" exact component={ReportingScreen} />
          <Route path="/automation" exact component={AutomationScreen} />
          <Route path="/comparison" exact component={ComparisonScreen} />
        </Switch>
      </div>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {
    common: state.common,
  };
};

export default connect(mapStateToProps, { getProjectId, generateCookies })(App);
