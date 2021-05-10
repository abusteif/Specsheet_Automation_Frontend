import React from "react";
import ReactDOM from "react-dom";

import KeyValueLine from "../../theme/keyValueLine";

import "../../styling/automationScreen.css";

const UploadSectionHeader = ({
  selectedDevice,
  selectedIotCycle,
  selectedRATSIM,
}) => {
  return (
    <>
      <KeyValueLine
        keyProp={"Device Under Test"}
        valueProp={selectedDevice.name}
      />
      <KeyValueLine keyProp={"IOT Cycle"} valueProp={selectedIotCycle.name} />
      <KeyValueLine keyProp={"Message Type"} valueProp={selectedRATSIM} />
    </>
  );
};

export default UploadSectionHeader;
