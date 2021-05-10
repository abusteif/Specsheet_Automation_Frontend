import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { getDevices, getProjectId } from "../actions/common-actions";

import Screen from "./screenTemplate";
import DropdownMenu from "../theme/dropdownMenu";
import SideMenu from "../theme/sideMenu";

import { apiErrorMessage, projectKey } from "../configs/staticData";

import "../styling/reportingScreen.css";

const ReportingScreen = (props) => {
  useEffect(() => {
    props.getProjectId(projectKey);
  }, []);
  return (
    <Screen
      subMessage={
        !props.common.status && apiErrorMessage + props.common.errorMessage
      }
    >
      <DropdownMenu
        itemList={[
          { name: "test1", value: "value1" },
          { name: "test2", value: "value2" },
        ]}
      />
      Coming Soon!
    </Screen>
  );
};

const mapStateToProps = (state) => {
  return {
    common: state.common,
  };
};

export default connect(mapStateToProps, { getProjectId })(ReportingScreen);
