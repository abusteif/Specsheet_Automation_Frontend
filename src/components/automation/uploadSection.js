import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import Spinner from "react-bootstrap/Spinner";

import { confirmAlert } from "react-confirm-alert";
import fileDownload from "js-file-download";
import history from "../../history";

import HexCodeInput from "./hexCodeInput";
import UploadSectionHeader from "./uploadSectionHeader";
import ButtonsSection from "../buttonsSection";
import ProgressBar from "../../theme/progressBar";
import Popup from "../../theme/popup";

import { checkIfAlreadyExecuted } from "../../helpers/apiCalls";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../../styling/automationScreen.css";
import "../../styling/commonStyles.css";
import "../../styling/theme/progressBar.css";

import { allRatSIMItems } from "../../configs/configurations";

var _ = require("lodash");

const UploadSection = ({
  selectedDevice,
  selectedIotCycle,
  selectedRATSIM,
  hexData,
  setHexData,
  resetHexData,
  validateHexData,
  hexDataValidateInFlight,
  isHexDataValidated,
  hexValidationError,
  resetValidationResult,
  populateSpecsheet,
  specsheet,
  resetSpecsheetGenerate,
  uploadSpecsheetToJira,
  resetSpecsheetUpload,
  resetIotCycleResults,
  checkIfAlreadyUploaded,
  backendToken,
}) => {
  const [testCaseExistCheck, setTestCaseExistCheck] = useState(false);
  useEffect(() => {
    {
      (hexData.attachRequest.alreadyUploaded ||
        hexData.UECapabilityInformation_4G.alreadyUploaded) &&
        confirmAlert({
          customUI: ({ onClose }) => {
            let key = "a";
            return (
              <Popup
                title="Test Case Already Executed!"
                message1={`Results of ${key} ${selectedRATSIM
                  .split("_")
                  .slice(1)
                  .join("_")} for ${selectedDevice.name} - ${
                  selectedIotCycle.name
                } were previously uploaded to Jira.`}
                message2=" Would like you to overwrite previous run? "
                onOk={() => {
                  if (hexData.attachRequest.alreadyUploaded) {
                    uploadSpecsheetToJira(
                      hexData.attachRequest.data,
                      "attachRequest",
                      selectedRATSIM.split("_").slice(1).join("_"),
                      selectedDevice.name,
                      selectedIotCycle.name
                    );
                    onClose();
                  }
                  if (hexData.UECapabilityInformation_4G.alreadyUploaded) {
                    uploadSpecsheetToJira(
                      hexData.UECapabilityInformation_4G.data,
                      "UECapabilityInformation_4G",
                      selectedRATSIM.split("_").slice(1).join("_"),
                      selectedDevice.name,
                      selectedIotCycle.name
                    );
                    onClose();
                  }
                }}
                onCancel={() => {
                  setTestCaseExistCheck(false);
                  onClose();
                }}
              />
            );
          },
          closeOnClickOutside: false,
        });
    }
  }, [
    hexData.attachRequest.alreadyUploaded,
    hexData.UECapabilityInformation_4G.alreadyUploaded,
  ]);

  const getButtonVariant = (button) => {
    switch (button) {
      case "specsheet":
        if (specsheet.isGenerateStarted) return "info";
        if (specsheet.docData) return "success";
        if (specsheet.generateError) return "danger";
        if (!getButtonDisabledStatus("specsheet")) return "primary";

        return "secondary";
      case "jiraUpload":
        return "secondary";
        // if (testCaseExistCheck) return "info";
        if (specsheet.uploadError) return "danger";
        if (specsheet.isUploadStarted || testCaseExistCheck) return "info";
        if (specsheet.isUploadComplete) return "success";
        if (!getButtonDisabledStatus("jiraUpload")) return "primary";
        return "secondary";
      default:
        return "primary";
    }
  };

  const getButtonLabel = (button) => {
    switch (button) {
      case "specsheet":
        if (specsheet.isGenerateStarted)
          return (
            <>
              {"Generating spec sheet. Please wait  "}
              <Spinner animation="border" variant="light" />
            </>
          );
        if (specsheet.docData)
          return "Spec sheet generated successfully! Click here to download";
        if (specsheet.generateError)
          return "An error occurred while generating the spec sheet. Please check HEX data and try again";
        if (
          hexData.UECapabilityInformation_5G.data.length > 1 &&
          hexData.UECapabilityInformation_4G.data.length < 1
        ) {
          return "5G spec sheet requires 4G HEX";
        }

        return "Populate spec sheet and download as Excel file";

      case "jiraUpload":
        return "Jira upload is not supported at the moment";
        if (testCaseExistCheck)
          return (
            <>
              {"Checking for existing execution  "}
              <Spinner animation="border" variant="light" />
            </>
          );

        if (specsheet.uploadError)
          return "Error while uploading results to Jira. Click here to try again";
        if (specsheet.isUploadStarted)
          return (
            <>
              Uploading Data to Jira. Please Wait
              <Spinner animation="border" variant="light" />
            </>
          );
        if (specsheet.isUploadComplete)
          return "Successfully uploaded results to Jira. Click here to view and compare";

        return "Generate data and upload to Jira";
      default:
        return "";
    }
  };

  const getButtonDisabledStatus = (button) => {
    let specSheetButtonStatus = false;
    let errorFound = true;
    let inFlight = true;
    _.forEach(hexData, (value, key) => {
      specSheetButtonStatus = specSheetButtonStatus || hexData[key].validated;
      errorFound = errorFound && !hexData[key].validationError;
      inFlight = inFlight && !hexData[key].validateInFlight;
    });

    switch (button) {
      case "specsheet":
        let missing4G =
          hexData.UECapabilityInformation_5G.data.length > 1 &&
          hexData.UECapabilityInformation_4G.data.length < 1;
        let missingUEdata =
          hexData.attachRequest.data.length > 1 &&
          hexData.UECapabilityInformation_5G.data.length < 1 &&
          hexData.UECapabilityInformation_4G.data.length < 1;

        return !(
          specSheetButtonStatus &&
          errorFound &&
          !specsheet.isGenerateStarted &&
          inFlight &&
          !missing4G &&
          !missingUEdata
        );
        break;
      case "jiraUpload":
        return (
          !(specSheetButtonStatus && errorFound && inFlight) ||
          specsheet.isUploadStarted ||
          testCaseExistCheck
        );

      default:
        return false;
    }
  };

  const getHexDataStatusMessage = (validationInfo) => {
    let statusMessage;
    let color;
    if (validationInfo.validateInFlight) {
      statusMessage = "Validating Hex Data";
      color = "grey";
    } else if (validationInfo.validated) {
      statusMessage = "Successfully validated Hex Data";
      color = "green";
    } else if (validationInfo.validationError) {
      statusMessage = "Error while validating Hex Data";
      color = "red";
    }
    return <span style={{ color }}>{statusMessage} </span>;
  };
  return (
    <div className="upload-section">
      <div className="upload-section-header">
        {
          //   <UploadSectionHeader
          //   selectedDevice={selectedDevice}
          //   selectedIotCycle={selectedIotCycle}
          //   selectedRATSIM={
          //     selectedRATSIM
          //       ? _.filter(allRatSIMItems, {
          //           value: selectedRATSIM,
          //         })[0].name
          //       : ""
          //   }
          // />
          //
          // <div
          //   className="border-shadow-bottom"
          //   style={{
          //     marginTop: "20px",
          //     alignSelf: "center",
          //     width: "70%",
          //   }}
          // />
        }
      </div>
      {
        <div className="upload-section-body">
          {
            //   selectedDevice.id &&
            // selectedIotCycle.id &&
            // selectedRATSIM && selectedRATSIM !== "5G" ? (
            <>
              <HexCodeInput
                role="attachRequest"
                headerText="Choose one of the following options to upload your data"
                placeholderText="Copy and paste the HEX code of the Attach Request message here"
                selectedRATSIM={selectedRATSIM}
                hexData={hexData.attachRequest.data}
                setHexData={(data) => setHexData(data, "attachRequest")}
                resetHexData={() => resetHexData("attachRequest")}
                validateHexData={validateHexData}
                resetValidationResult={() =>
                  resetValidationResult("attachRequest")
                }
                resetSpecsheetGenerate={resetSpecsheetGenerate}
                resetSpecsheetUpload={resetSpecsheetUpload}
                isUploadComplete={specsheet.isUploadComplete}
                resetIotCycleResults={resetIotCycleResults}
                statusMessage={getHexDataStatusMessage(hexData.attachRequest)}
                disabled={
                  hexData.attachRequest.validateInFlight ||
                  specsheet.isUploadStarted ||
                  specsheet.isGenerateStarted
                }
              />
              <HexCodeInput
                role="UECapabilityInformation_4G"
                selectedRATSIM={selectedRATSIM}
                hexData={hexData.UECapabilityInformation_4G.data}
                setHexData={(data) =>
                  setHexData(data, "UECapabilityInformation_4G")
                }
                resetHexData={() => resetHexData("UECapabilityInformation_4G")}
                validateHexData={validateHexData}
                resetValidationResult={() =>
                  resetValidationResult("UECapabilityInformation_4G")
                }
                resetSpecsheetGenerate={resetSpecsheetGenerate}
                resetSpecsheetUpload={resetSpecsheetUpload}
                isUploadComplete={specsheet.isUploadComplete}
                resetIotCycleResults={resetIotCycleResults}
                statusMessage={getHexDataStatusMessage(
                  hexData.UECapabilityInformation_4G
                )}
                disabled={
                  hexData.UECapabilityInformation_4G.validateInFlight ||
                  specsheet.isUploadStarted ||
                  specsheet.isGenerateStarted
                }
              />
              <HexCodeInput
                role="UECapabilityInformation_5G"
                selectedRATSIM={selectedRATSIM}
                hexData={hexData.UECapabilityInformation_5G.data}
                setHexData={(data) =>
                  setHexData(data, "UECapabilityInformation_5G")
                }
                resetHexData={() => resetHexData("UECapabilityInformation_5G")}
                validateHexData={validateHexData}
                resetValidationResult={() =>
                  resetValidationResult("UECapabilityInformation_5G")
                }
                resetSpecsheetGenerate={resetSpecsheetGenerate}
                resetSpecsheetUpload={resetSpecsheetUpload}
                isUploadComplete={specsheet.isUploadComplete}
                resetIotCycleResults={resetIotCycleResults}
                statusMessage={getHexDataStatusMessage(
                  hexData.UECapabilityInformation_5G
                )}
                disabled={
                  hexData.UECapabilityInformation_5G.validateInFlight ||
                  specsheet.isUploadStarted ||
                  specsheet.isGenerateStarted
                }
              />

              <ButtonsSection
                sectionClassName="upload-section-buttons-section"
                buttons={[
                  {
                    label: getButtonLabel("specsheet"),
                    disabled: getButtonDisabledStatus("specsheet"),
                    variant: getButtonVariant("specsheet"),
                    className: "upload-section-button",
                    size: "lg",

                    onClick: () => {
                      if (specsheet.isGenerateReady) {
                        fileDownload(
                          specsheet.docData,
                          hexData.UECapabilityInformation_5G.data.length < 1
                            ? `MSR0835_${selectedDevice.name}_${selectedIotCycle.name}.xlsx`
                            : `ENDC_MSR0835_${selectedDevice.name}_${selectedIotCycle.name}.xlsx`
                        );
                        resetSpecsheetGenerate();
                      } else {
                        let data = {};
                        _.forEach(hexData, (value, key) => {
                          if (hexData[key].validated) {
                            data[key] = hexData[key].data;
                          }
                        });
                        populateSpecsheet(
                          data,
                          selectedDevice.name,
                          selectedIotCycle.name
                        );
                      }
                    },
                    key: "specsheet",
                  },
                  {
                    label: getButtonLabel("jiraUpload"),
                    // disabled: getButtonDisabledStatus("jiraUpload"),
                    disabled: true,
                    variant: getButtonVariant("jiraUpload"),
                    className: "upload-section-button",
                    size: "lg",

                    onClick: () => {
                      setTestCaseExistCheck(true);
                      if (
                        !specsheet.isUploadComplete ||
                        specsheet.uploadError
                      ) {
                        if (specsheet.uploadError) {
                          resetSpecsheetUpload();
                        }
                        /// TODO: selectedRATSIM
                        _.forEach(hexData, (value, key) => {
                          if (hexData[key].validated) {
                            checkIfAlreadyUploaded(
                              selectedDevice.name,
                              selectedIotCycle.name,
                              selectedRATSIM.split("_").slice(1).join("_"),
                              key
                            );
                            let callBackFalse = () => {
                              setTestCaseExistCheck(false);

                              uploadSpecsheetToJira(
                                hexData[key].data,
                                key,
                                // selectedRATSIM.split("_")[1],
                                selectedRATSIM.split("_").slice(1).join("_"),

                                selectedDevice.name,
                                selectedIotCycle.name
                              );
                            };

                            let callBackTrue = () => {
                              confirmAlert({
                                customUI: ({ onClose }) => {
                                  return (
                                    <Popup
                                      title="Test Case Already Executed!"
                                      message1={`Results of ${key} ${selectedRATSIM
                                        .split("_")
                                        .slice(1)
                                        .join("_")} for ${
                                        selectedDevice.name
                                      } - ${
                                        selectedIotCycle.name
                                      } were previously uploaded to Jira.`}
                                      message2=" Would like you to overwrite previous run? "
                                      onOk={() => {
                                        uploadSpecsheetToJira(
                                          hexData[key].data,
                                          key,
                                          selectedRATSIM
                                            .split("_")
                                            .slice(1)
                                            .join("_"),
                                          selectedDevice.name,
                                          selectedIotCycle.name
                                        );
                                        onClose();
                                      }}
                                      onCancel={() => {
                                        setTestCaseExistCheck(false);
                                        onClose();
                                      }}
                                    />
                                  );
                                },
                                closeOnClickOutside: false,
                              });

                              setTestCaseExistCheck(false);
                            };
                            checkIfAlreadyExecuted(
                              selectedDevice.name,
                              selectedIotCycle.name,
                              selectedRATSIM.split("_").slice(1).join("_"),
                              key,
                              backendToken,
                              null,
                              callBackFalse,
                              () => {
                                setTestCaseExistCheck(false);
                              }
                            );
                          }
                        });
                      } else {
                        history.push("/comparison");
                      }
                    },
                    key: "jiraUpload",
                  },
                ]}
              />
            </>
            // ) : (
            //   selectedDevice.id &&
            //   selectedIotCycle.id &&
            //   selectedRATSIM && (
            //     <span
            //       style={{ fontSize: 20, color: "red", fontStyle: "italic" }}
            //     >
            //       {`Sorry ${selectedRATSIM} message type is not supported yet.`}
            //     </span>
            //   )
            // )
          }
        </div>
      }
    </div>
  );
};
export default UploadSection;
