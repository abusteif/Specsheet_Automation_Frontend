import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import FileDropZone from "../../theme/fileDropZone";

import TextArea from "../../theme/textArea";

import { allRatSIMItems } from "../../configs/configurations";

var _ = require("lodash");

const HexCodeInput = ({
  role,
  headerText,
  selectedRATSIM,
  hexData,
  setHexData,
  resetHexData,
  validateHexData,
  resetValidationResult,
  resetSpecsheetGenerate,
  isUploadComplete,
  resetSpecsheetUpload,
  resetIotCycleResults,
  statusMessage,
  disabled,
  placeholderText,
}) => {
  // useEffect(() => {
  //   // componentWillUnmount
  //   return () => {
  //     resetHexData();
  //   };
  // }, []);

  const messageName = `${
    _.filter(allRatSIMItems, {
      value: selectedRATSIM,
    })[0].name
  } - ${role}`;

  const onRead = useCallback(
    (data) => {
      setHexData(data);
      resetValidationResult();
      resetSpecsheetGenerate();
      resetIotCycleResults();
      resetSpecsheetUpload();
      if (data !== "") validateHexData(data, role, selectedRATSIM);

      if (isUploadComplete) resetSpecsheetUpload();
    },
    [selectedRATSIM]
  );

  return (
    <>
      <div style={{ fontSize: 20, alignSelf: "center", paddingBottom: "30px" }}>
        {headerText}
      </div>
      <div className="hex-input-row">
        <FileDropZone
          placeholder={
            placeholderText
              ? placeholderText
              : `Drag and drop the ${messageName} file here`
          }
          textProcessor={(text) => text.replace(/\s/g, "")}
          messageType={`${role}_${selectedRATSIM}`}
          onRead={onRead}
          requiredFileType="text/plain"
          uploadStatus={hexData === "" ? false : true}
          disabled={disabled}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "40%" }}>
          <TextArea
            placeholder={
              placeholderText
                ? placeholderText
                : `Copy and paste the HEX code of the ${messageName} message here`
            }
            textProcessor={(text) => text.replace(/\s/g, "")}
            onRead={onRead}
            initialValue={hexData}
            disabled={disabled}
          />
          <span> {statusMessage}</span>
        </div>
      </div>
    </>
  );
};

export default HexCodeInput;
