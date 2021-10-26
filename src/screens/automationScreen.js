import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import {
  getDevices,
  getIotCycles,
  selectDevice,
  selectIotCycle,
  getProjectId,
  resetSelectedIotCycle,
  resetAllIotCycles,
  resetSelectedDevice,
} from "../actions/common-actions";
import {
  selectRATSIM,
  resetRATSIM,
  setHexData,
  resetHexData,
  validateHexData,
  populateSpecsheet,
  resetValidationResult,
  resetSpecsheetGenerate,
  uploadSpecsheetToJira,
  resetSpecsheetUpload,
  checkIfAlreadyUploaded,
} from "../actions/automation-actions";

import {
  resetIotCycleResults,
  resetSecondaryDevice,
  resetSecondaryIotCycles,
  resetSecondaryIotCycle,
} from "../actions/comparison-actions";
import DropdownMenu from "../theme/dropdownMenu";
import Screen from "./screenTemplate";
import DeviceSelectionSection from "../components/deviceSelectionSection";
import UploadSection from "../components/automation/uploadSection";
import MessageTypeSection from "../components/automation/messageTypeSection";

import { apiErrorMessage, projectKey } from "../configs/staticData";
import { allRatSIMItems } from "../configs/configurations";

const AutomationScreen = (props) => {
  useEffect(() => {
    if (props.common.projectId) {
      props.getDevices(props.common.projectId);
    } else {
      props.getProjectId(projectKey);
    }
    return () => {
      props.resetHexData();
      props.resetValidationResult();
      props.resetSpecsheetUpload();
    };
  }, [props.common.projectId]);

  return (
    <Screen
      subMessage={
        !props.common.status && apiErrorMessage + props.common.errorMessage
      }
    >
      <DeviceSelectionSection
        disableAll={
          props.automation.specsheet.isGenerateStarted ||
          props.automation.specsheet.isUploadStarted
        }
        devices={props.common.devices}
        deviceText="Select DUT"
        onSelectDevice={(selectedDevice) => {
          props.resetAllIotCycles();
          props.resetHexData();
          props.resetRATSIM();
          props.resetSpecsheetUpload();
          props.resetSpecsheetGenerate();
          props.getIotCycles(selectedDevice, props.common.projectId);
          props.selectDevice(selectedDevice);
          props.resetSelectedIotCycle();
        }}
        selectedDevice={props.common.selectedDevice}
        iotCycles={props.common.iotCycles}
        iotCycleText="Select IOT Cycle"
        onSelectIotCycle={(selectIotCycle) => {
          props.selectIotCycle(selectIotCycle);
          props.resetHexData();
          props.resetRATSIM();
          props.resetSpecsheetUpload();
          props.resetSpecsheetGenerate();
        }}
        resetSelectedIotCycle={
          Object.keys(props.common.selectedIotCycle).length === 0
        }
        selectedIotCycle={props.common.selectedIotCycle}
        allRatSIMItems={allRatSIMItems}
        messageTypeText="Select RAT and SIM"
        onSelectMessagetType={(type) => {
          props.selectRATSIM(type);
          props.resetHexData();
          props.resetSpecsheetUpload();
          props.resetSpecsheetGenerate();
        }}
        selectedRATSIM={props.automation.selectedRATSIM}
        resetRATSIM={props.automation.selectedRATSIM ? false : true}
      />
      <UploadSection
        selectedDevice={props.common.selectedDevice}
        selectedIotCycle={props.common.selectedIotCycle}
        selectedRATSIM={props.automation.selectedRATSIM}
        hexData={props.automation.hexData}
        setHexData={props.setHexData}
        resetHexData={props.resetHexData}
        validateHexData={props.validateHexData}
        // isHexDataValidated={props.automation.isHexDataValidated}
        // hexValidationError={props.automation.hexValidationError}
        // hexDataValidateInFlight={props.automation.hexDataValidateInFlight}

        resetValidationResult={props.resetValidationResult}
        populateSpecsheet={props.populateSpecsheet}
        specsheet={props.automation.specsheet}
        resetSpecsheetGenerate={props.resetSpecsheetGenerate}
        uploadSpecsheetToJira={props.uploadSpecsheetToJira}
        resetSpecsheetUpload={props.resetSpecsheetUpload}
        resetIotCycleResults={() => {
          props.resetIotCycleResults(["main", "secondary"]);
          // props.resetSecondaryDevice();
          // props.resetSecondaryIotCycles();
          // props.resetSecondaryIotCycle();
        }}
        checkIfAlreadyUploaded={props.checkIfAlreadyUploaded}
        backendToken={props.common.token}
      />
    </Screen>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    common: state.common,
    automation: state.automation,
  };
};
export default connect(mapStateToProps, {
  getDevices,
  getIotCycles,
  getProjectId,
  selectDevice,
  selectIotCycle,
  resetSelectedIotCycle,
  resetAllIotCycles,
  selectRATSIM,
  resetRATSIM,
  setHexData,
  resetHexData,
  validateHexData,
  populateSpecsheet,
  resetValidationResult,
  resetSpecsheetGenerate,
  uploadSpecsheetToJira,
  resetSpecsheetUpload,
  resetIotCycleResults,
  resetSecondaryDevice,
  resetSecondaryIotCycles,
  resetSecondaryIotCycle,
  resetSelectedDevice,
  checkIfAlreadyUploaded,
})(AutomationScreen);
