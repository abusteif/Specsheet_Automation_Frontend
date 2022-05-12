import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { confirmAlert } from "react-confirm-alert";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-datepicker";

import TextArea from "../../theme/textArea";
import DropdownMenu from "../../theme/dropdownMenu";
import FormItem from "../../theme/formItem";
import LongFormItem from "../../theme/longFormItem";
import TextInputField from "../../theme/textInputField";
import CreationStatusPopup from "./creationStatusPopup";
import Popup from "../../theme/popup";

import "react-datepicker/dist/react-datepicker.css";
import "../../styling/theme/datePicker.css";
import "../../styling/theme/formItem.css";

import {
  SUCCESS,
  ERROR,
  UNSTARTED,
  STARTED,
} from "../../configs/configurations";
import { jiraTicketBaseURL } from "../../configs/staticData";
const JiraReleaseForm = ({
  vendorList,
  getDevicesForVendor,
  devicesForVendor,
  selectVendor,
  selectedVendor,
  selectModel,
  selectedModel,
  testingRequestTypes,
  selectedTestingRequestType,
  selectTestingRequestType,
  selectedMarketName,
  creationStatus,
  newCreatedKey,
  resetCreationStatus,
  resetDevicesForVendorList,
  // selectTestingPriority,
  // testingPriorities,
  // selectedTestingPriority,
  selectWDATestScope,
  wdaTestScopes,
  selectedWDATestScope,
  selectFunding,
  selectedFunding,
  funding,
  selectBaselineDate,
  selectActualDate,
  selectedBaselineDate,
  selectedActualDate,
  selectBAUNumber,
  selectedBAUNumber,
  selectChangeDescription,
  selectedChangeDescription,
  createRelease,
  selectAsset,
  selectRelease,
  selectDeviceType,
  selectedDeviceType,

  selectMarketName,
  getReleasesForDevice,
  releasesForDevice,
  loginDetails,
  resetAll,
  backendRequestStatus,
  modified,
}) => {
  const [saveButton, setSaveButton] = useState(false);
  const [resetValue, setResetValue] = useState(false);
  const [summary, setSummary] = useState("");
  const [epicName, setEpicName] = useState("");
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [releaseDetails, setReleaseDetails] = useState([]);

  // useEffect(() => {
  //   return () => {
  //     resetAll();
  //   };
  // }, []);

  useEffect(() => {
    if (creationStatus !== UNSTARTED) resetCreationStatus();
    if (
      !selectedVendor ||
      !selectedModel ||
      !selectedTestingRequestType ||
      !selectedBaselineDate ||
      !selectedFunding ||
      !selectedWDATestScope
    )
      setSaveButton(false);
    else {
      if (selectedTestingRequestType === "WDA_New Device Testing")
        setSaveButton(true);
      else {
        setSaveButton(selectedChangeDescription);
      }
    }

    const date = new Date();
    let localEpicName = `${selectedVendor} ${selectedModel}_`;
    if (selectedTestingRequestType === "WDA_New Device Testing")
      localEpicName = localEpicName + "WDA_New Device Testing";
    else {
      if (releasesForDevice.length > 0) {
        localEpicName = localEpicName + "MR" + releasesForDevice.length;
      } else {
        localEpicName = localEpicName + "MR";
      }
    }
    setEpicName(localEpicName);
    // setEpicName(
    //   `${selectedVendor} ${selectedModel}_${
    //     selectedTestingRequestType.split("WDA_")[1]
    //   }`
    // );
    const initials = loginDetails.displayName
      .split(" ")
      .map((n) => n[0])
      .join("");
    const summaryDescription = `New "${
      selectedTestingRequestType.split("_")[1]
    }" project created`;

    setSummary(
      `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
        .toString()
        .padStart(
          2,
          "0"
        )} ${initials}: ${selectedVendor} ${selectedModel} - ${summaryDescription}`
    );

    setReleaseDetails([
      { fieldName: "Summary", fieldValue: summary },

      { fieldName: "Vendor", fieldValue: selectedVendor },
      { fieldName: "Model", fieldValue: selectedModel },
      {
        fieldName: "Epic Name",
        fieldValue: localEpicName,
      },
      {
        fieldName: "Testing Request Type",
        fieldValue: selectedTestingRequestType,
      },
      // {
      //   fieldName: "Testing Priority",
      //   fieldValue: selectedTestingPriority,
      // },
      {
        fieldName: "WDA Test Scope",
        fieldValue: selectedWDATestScope,
      },
      {
        fieldName: "Baseline Date",
        fieldValue:
          selectedBaselineDate &&
          `${selectedBaselineDate.getDate()}-${
            selectedBaselineDate.getMonth() + 1
          }-${selectedBaselineDate.getFullYear()}`,
      },
      {
        fieldName: "Funding",
        fieldValue: selectedFunding,
      },
      {
        fieldName: "Change Description",
        fieldValue: selectedChangeDescription,
      },
    ]);
  }, [
    selectedVendor,
    selectedModel,
    selectedTestingRequestType,
    selectedBaselineDate,
    selectedFunding,
    selectedWDATestScope,
    selectedChangeDescription,
    releasesForDevice,
    // epicName,
  ]);

  useEffect(() => {
    if (confirmDetails) {
      confirmAlert({
        customUI: ({ onClose }) => {
          const deviceModel = selectedModel.split("(")[0].trim();
          return (
            <CreationStatusPopup
              status="Confirm Release Details"
              title="The following Release will be created. Click OK to confirm"
              lineItems={releaseDetails}
              color="blue"
              onOk={() => {
                createRelease({
                  epicName: epicName,
                  summary: summary,
                  testingRequestType: selectedTestingRequestType,
                  // testingPriority: selectedTestingPriority,
                  wdaTestScope: selectedWDATestScope,
                  parentLink: devicesForVendor.find((item) => {
                    return item.model === selectedModel;
                  }).key,
                  baselineDate: `${selectedBaselineDate.getFullYear()}-${
                    selectedBaselineDate.getMonth() + 1
                  }-${selectedBaselineDate.getDate()}`,
                  changeDescription: selectedChangeDescription,
                  funding: selectedFunding,
                  issueType: "release",
                  vendor: selectedVendor,
                  deviceModel: deviceModel,
                  deviceType: selectedDeviceType,
                });
                setConfirmDetails(false);
                onClose();
              }}
              onCancel={() => {
                setConfirmDetails(false);
                onClose();
              }}
            />
          );
        },

        closeOnClickOutside: true,
        onClickOutside: () => {
          setConfirmDetails(false);
        },
      });
    }
  }, [confirmDetails]);

  useEffect(() => {
    if (creationStatus !== UNSTARTED) setSaveButton(false);
    if (creationStatus === SUCCESS) {
      getReleasesForDevice(getKeyForModel(devicesForVendor, selectedModel));
      // console.log(newCreatedKey);
      selectRelease(newCreatedKey);
    }

    creationStatus !== UNSTARTED &&
      confirmAlert({
        customUI: ({ onClose }) => {
          switch (creationStatus) {
            case STARTED:
              return (
                <CreationStatusPopup
                  status={
                    <>
                      {"CREATING YOUR RELEASE  "}
                      <Spinner
                        animation="border"
                        style={{ height: "20px", width: "20px" }}
                      />
                    </>
                  }
                  title="Device Details: "
                  lineItems={releaseDetails}
                  color="blue"
                />
              );
            case SUCCESS:
              return (
                <CreationStatusPopup
                  status="SUCCESS!"
                  title="The following Release was successfully created in Jira:"
                  lineItems={releaseDetails}
                  color="green"
                  footerTextLink={`Click here to access the Jira Epic (${newCreatedKey})`}
                  footerLink={`${jiraTicketBaseURL}${newCreatedKey}`}
                  footerTextNonLink="Would you like to create an IOT Cycle associated with this Release?"
                  onOk={() => {
                    selectAsset("IOT Cycle");
                    selectModel(selectedModel);
                    resetCreationStatus();
                    onClose();
                  }}
                  okText="Create IOT Cycle"
                  onCancel={() => {
                    onClose();
                  }}
                />
              );
            case ERROR:
              return (
                <CreationStatusPopup
                  status="ERROR!"
                  title="An error occured while creating a Release with the following details:"
                  lineItems={releaseDetails}
                  color="red"
                  footerTextNonLink="Please try again later"
                />
              );
          }
        },
        closeOnClickOutside: creationStatus !== STARTED,
        onClickOutside: () => {
          if (creationStatus === SUCCESS) resetAll();
          if (creationStatus === ERROR) resetCreationStatus();
        },
      });
  }, [creationStatus]);

  const getKeyForModel = (allModel, desiredModel) => {
    const modelId = allModel.find((item) => {
      return item.model === desiredModel;
    });
    return modelId.key;
  };

  return (
    <div className="jira-work-section-body">
      <div className="jira-work-section-options-section">
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">Select Vendor</span>
            <DropdownMenu
              itemList={vendorList.map((vendor) => {
                return { name: vendor.name, value: vendor.name };
              })}
              onSelect={(vendor) => {
                resetDevicesForVendorList();
                getDevicesForVendor(vendor);
                selectVendor(vendor);
                setResetValue(true);
                selectModel("");
              }}
              placeholder="Vendor"
              disabled={
                vendorList.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={selectedVendor}
              resetValue={!modified}
            />
            {selectedVendor &&
              devicesForVendor.length === 0 &&
              backendRequestStatus !== STARTED && (
                <span
                  style={{
                    fontStyle: "italic",
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  No devices found for the selected Vendor
                </span>
              )}
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">Select Device Model</span>
            <DropdownMenu
              itemList={devicesForVendor.map((device) => {
                return {
                  name: `${device.model} ${
                    device.marketName === undefined
                      ? ""
                      : `(${device.marketName})`
                  }`,
                  value: device.model,
                };
              })}
              onSelect={(model) => {
                setResetValue(false);
                selectModel(model);
                let marketName = devicesForVendor.find((d) => {
                  return d.model === model;
                })?.marketName;

                selectMarketName(marketName ?? "");
                let deviceType = devicesForVendor.find((d) => {
                  return d.model === model;
                })?.type;
                selectDeviceType(deviceType);
                getReleasesForDevice(getKeyForModel(devicesForVendor, model));
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Device Model"
              }
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={selectedModel}
              resetValue={resetValue}
            />
          </FormItem>
        </LongFormItem>
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">
              Select Testing Request Type
            </span>
            <DropdownMenu
              itemList={testingRequestTypes.map((type) => {
                return { name: type.name, value: type.name };
              })}
              onSelect={(type) => {
                selectTestingRequestType(type);
                selectChangeDescription("");
              }}
              placeholder="Testing Request Type"
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={selectedTestingRequestType}
              resetValue={!modified}
            />
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">
              Select WDA Test Scope
            </span>
            <DropdownMenu
              itemList={wdaTestScopes.map((scope) => {
                return { name: scope.name, value: scope.name };
              })}
              onSelect={(scope) => {
                selectWDATestScope(scope);
              }}
              placeholder="WDA Test Scope"
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={selectedWDATestScope}
              resetValue={!modified}
            />
          </FormItem>
        </LongFormItem>
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">Select Funding</span>
            <DropdownMenu
              itemList={funding.map((fund) => {
                return { name: fund.name, value: fund.name };
              })}
              onSelect={(fund) => {
                selectFunding(fund);
              }}
              placeholder="Funding"
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={selectedFunding}
              resetValue={!modified}
            />
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">
              Select Baseline TA Date
            </span>
            <div className="customDatePickerWidth">
              <DatePicker
                disabled={
                  devicesForVendor.length === 0 ||
                  backendRequestStatus == STARTED
                }
                onChange={(e) => {
                  selectBaselineDate(e);
                }}
                selected={selectedBaselineDate}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </FormItem>
        </LongFormItem>
        <FormItem style={{ height: "120px" }}>
          <span className="item-selection-headings">
            Enter a brief change description
          </span>
          <div style={{ width: "50%", height: "100%" }}>
            <TextArea
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              maxLength={255}
              onBlur={selectChangeDescription}
              initialValue={selectedChangeDescription}
              resetValue={!modified}
            />
          </div>
        </FormItem>
      </div>
      <div className="jira-work-section-buttons-section">
        <Button
          variant={"primary"}
          className="jira-work-section-buttons"
          size="lg"
          key={"save"}
          disabled={
            !saveButton
            // selectedDeviceType === "" || creationStatus !== UNSTARTED
          }
          onClick={() => {
            setConfirmDetails(true);
          }}
        >
          {"SAVE"}
        </Button>
        <Button
          variant={"danger"}
          className="jira-work-section-buttons"
          size="lg"
          key={"discard"}
          disabled={!modified}
          onClick={resetAll}
        >
          {"RESET ALL"}
        </Button>
      </div>
    </div>
  );
};

export default JiraReleaseForm;
