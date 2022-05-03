import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import Screen from "./screenTemplate";
import TabView from "../theme/tabView";
import ComparisonTabs from "../components/comparison/comparisonTabs";
import DeviceSelectionSection from "../components/deviceSelectionSection";

import {
  getMessageFields,
  getIotCycleResults,
  resetIotCycleResults,
  getDeviceList,
  getIotCycles,
  getMainIotCycle,
  getMainDevice,
  resetSecondaryIotCycles,
  selectSecondaryDevice,
  resetSecondaryIotCycle,
  selectSecondaryIotCycle,
  selectSecondaryRATSIM,
  getMainRATSIM,
  resetSecondaryRATSIM,
  resetSecondaryDevice,
} from "../actions/comparison-actions";

import { apiErrorMessage, projectKey } from "../configs/staticData";
import { allRatSIMItems } from "../configs/configurations";

const ComparisonScreen = (props) => {
  useEffect(() => {
    if (
      props.automation.projectId &&
      Object.keys(props.common.selectedDevice).length > 0
    ) {
      props.getMessageFields("UECapabilityInformation_4G");
    }
  }, [props.automation.projectId]);

  useEffect(() => {
    if (Object.keys(props.common.selectedDevice).length > 0) {
      props.getDeviceList();
      props.getMainIotCycle();
      props.getMainDevice();
      props.getMainRATSIM();

      if (
        !props.comparison.results.mainResult.uecapabilityInformation &&
        props.comparison.mainRATSIM
      )
        props.getIotCycleResults(
          props.common.selectedDevice.name,
          props.common.selectedIotCycle.name,
          "UECapabilityInformation_4G",
          props.comparison.mainRATSIM.split("_").slice(1).join("_"),
          "main"
        );
    }
    return () => {
      props.resetSecondaryDevice();
      props.resetSecondaryRATSIM();
      props.resetSecondaryIotCycle();
      props.resetSecondaryIotCycles();
      props.resetIotCycleResults(["main", "secondary"]);
    };
  }, [props.comparison.mainRATSIM]);

  return (
    <Screen
      subMessage={
        !props.common.status && apiErrorMessage + props.common.errorMessage
      }
    >
      {Object.keys(props.common.selectedDevice).length > 0 ? (
        <>
          <DeviceSelectionSection
            disableAll={props.comparison.results.secondaryInFlight}
            devices={props.comparison.devices}
            deviceText="Select reference device:"
            onSelectDevice={(selectedDevice) => {
              props.resetIotCycleResults(["secondary"]);
              props.resetSecondaryIotCycles();
              props.getIotCycles(selectedDevice, props.automation.projectId);

              props.selectSecondaryDevice(selectedDevice);
              props.resetSecondaryIotCycle();
              props.resetSecondaryRATSIM();
            }}
            selectedDevice={props.comparison.secondaryDevice}
            iotCycles={props.comparison.secondaryIotCycles}
            iotCycleText="Select reference IOT cycle:"
            onSelectIotCycle={(selectedIotCycle) => {
              props.resetIotCycleResults(["secondary"]);
              props.resetSecondaryRATSIM();
              props.selectSecondaryIotCycle(selectedIotCycle);
            }}
            resetSelectedIotCycle={
              Object.keys(props.comparison.secondaryIotCycle).length === 0
            }
            selectedIotCycle={props.comparison.secondaryIotCycle}
            allRatSIMItems={allRatSIMItems}
            messageTypeText="Select reference RAT and SIM:"
            resetRATSIM={props.comparison.secondaryRATSIM ? false : true}
            onSelectMessagetType={(selectedRATSIM) => {
              props.resetIotCycleResults(["secondary"]);
              props.selectSecondaryRATSIM(selectedRATSIM);
              props.getIotCycleResults(
                props.comparison.secondaryDevice.name,
                props.comparison.secondaryIotCycle.name,
                "UECapabilityInformation_4G",
                selectedRATSIM.split("_").slice(1).join("_"),
                "secondary"
              );
            }}
            selectedRATSIM={props.comparison.secondaryRATSIM}
          />

          <ComparisonTabs
            mainInfo={{
              device: props.comparison.mainDevice,
              iotCycle: props.comparison.mainIotCycle,
            }}
            secondaryInfo={{
              device: props.comparison.secondaryDevice,
              iotCycle: props.comparison.secondaryIotCycle,
            }}
            mainError={props.comparison.results.mainError}
            mainRetry={() => {
              props.resetIotCycleResults(["main"]);

              props.getIotCycleResults(
                props.common.selectedDevice.name,
                props.common.selectedIotCycle.name,
                "UECapabilityInformation_4G",
                props.comparison.mainRATSIM.split("_").slice(1).join("_"),
                "main"
              );
            }}
            secondaryError={props.comparison.results.secondaryError}
            secondaryRetry={() => {
              props.resetIotCycleResults(["secondary"]);
              props.getIotCycleResults(
                props.comparison.secondaryDevice.name,
                props.comparison.secondaryIotCycle.name,
                // props.automation.selectedMessageType,
                "UECapabilityInformation_4G",
                props.comparison.secondaryRATSIM.split("_").slice(1).join("_"),

                "secondary"
              );
            }}
            fields={props.comparison.messageFields}
            mainData={props.comparison.results.mainResult}
            secondaryData={props.comparison.results.secondaryResult}
            mainRATSIM={props.comparison.mainRATSIM}
            secondaryRATSIM={props.comparison.secondaryRATSIM}
          />
        </>
      ) : (
        <div style={{ fontSize: "30px", padding: "40px" }}>
          Please do not refresh this page. If you need to make any changes,
          navigate back to the Automation screen.
        </div>
      )}
    </Screen>
  );
};

const mapStateToProps = (state) => {
  return {
    common: state.common,
    automation: state.automation,
    comparison: state.comparison,
  };
};
export default connect(mapStateToProps, {
  getMessageFields,
  getIotCycleResults,
  resetIotCycleResults,
  getDeviceList,
  getIotCycles,
  getMainIotCycle,
  getMainDevice,
  resetSecondaryIotCycles,
  getIotCycles,
  selectSecondaryDevice,
  resetSecondaryIotCycle,
  selectSecondaryIotCycle,
  selectSecondaryRATSIM,
  getMainRATSIM,
  resetSecondaryRATSIM,
  resetSecondaryDevice,
})(ComparisonScreen);
