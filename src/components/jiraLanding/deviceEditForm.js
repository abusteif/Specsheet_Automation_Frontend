import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { confirmAlert } from "react-confirm-alert";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import DropdownMenu from "../../theme/dropdownMenu";
import FormItem from "../../theme/formItem";
import LongFormItem from "../../theme/longFormItem";
import TextInputField from "../../theme/textInputField";
import CreationStatusPopup from "./creationStatusPopup";

import {
  SUCCESS,
  ERROR,
  UNSTARTED,
  STARTED,
} from "../../configs/configurations";
import { jiraTicketBaseURL } from "../../configs/staticData";
const JiraDeviceEditForm = ({
  getVendors,
  vendorList,
  getDeviceTypes,
  deviceTypes,
  creationStatus,
  resetCreationStatus,
  getDevicesForVendor,
  devicesForVendor,
  updateDevice,
  backendRequestStatus,
  setModified,
  resetAll,
}) => {
  const [saveButton, setSaveButton] = useState(false);
  const [summary, setSummary] = useState("");
  const [marketNameCheckBox, setMarketNameCheckBox] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [initialDeviceDetails, setInitialDeviceDetails] = useState({
    summary: "",
    model: "",
    deviceType: "",
    marketName: "",
  });
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [resetValue, setResetValue] = useState(false);

  const [vendor, setVendor] = useState("");
  const [model, setModel] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [marketName, setMarketName] = useState("");
  const [issueKey, setIssueKey] = useState("");

  const modulesAndIoTDevices = [
    "LTE Modules",
    "5G Modules",
    "Integrated Device",
  ];
  const handleMarketNameCheckBox = (event) => {
    if (event.currentTarget.checked) {
      setMarketNameCheckBox(true);
      setMarketName(model);
    }
    if (!event.currentTarget.checked) {
      // setMarketName(market);
      setMarketNameCheckBox(false);
    }
  };

  const resetDeviceDetails = () => {
    setModel("");
    setMarketName("");
    setDeviceType("");
    setIssueKey("");
    setInitialDeviceDetails({ model: "", deviceType: "", marketName: "" });
  };

  const resetDeviceDetailsToInitial = () => {
    setModel(initialDeviceDetails.model);
    setMarketName(initialDeviceDetails.marketName);
    setDeviceType(initialDeviceDetails.deviceType);
    setMarketNameCheckBox(false);
  };

  const checkIfChanged = () => {
    // console.log(initialDeviceDetails.marketName);
    // console.log(marketName);
    // console.log(initialDeviceDetails.model);
    // console.log(model);
    // console.log(initialDeviceDetails.deviceType);
    // console.log(deviceType);
    // console.log(
    //   model !== initialDeviceDetails.model ||
    //     deviceType !== initialDeviceDetails.deviceType ||
    //     marketName !== initialDeviceDetails.marketName
    // );
    return (
      model !== initialDeviceDetails.model ||
      deviceType !== initialDeviceDetails.deviceType ||
      marketName !== initialDeviceDetails.marketName
    );
  };

  const getFinalDeviceDetails = () => {
    let details = {
      issueType: "device",
      vendor: vendor,
    };
    if (summary !== initialDeviceDetails.summary)
      details = { ...details, summary };
    if (
      marketName !== initialDeviceDetails.marketName ||
      model !== initialDeviceDetails.model
    )
      details = { ...details, modelMarketName: `${model} (${marketName})` };

    if (model !== initialDeviceDetails.model)
      details = { ...details, deviceModel: model };

    if (deviceType !== initialDeviceDetails.deviceType)
      details = { ...details, type: deviceType, deviceType };

    console.log(details);
    return details;
  };

  useEffect(() => {
    let localSummary = `${vendor} ${model} (${marketName})`;
    if (creationStatus !== UNSTARTED) resetCreationStatus();
    if (
      !model ||
      !deviceType ||
      !checkIfChanged() ||
      (!modulesAndIoTDevices.includes(deviceType) && !marketName)
    )
      setSaveButton(false);
    // disable save button
    else {
      setSaveButton(true);
    }

    setSummary(localSummary);
    setDeviceDetails([
      {
        fieldName: "Summary",
        fieldValue: localSummary,
        valueColor:
          localSummary !== initialDeviceDetails.summary ? "red" : null,
      },

      { fieldName: "Vendor", fieldValue: vendor },
      {
        fieldName: "Model",
        fieldValue: model,
        valueColor: model !== initialDeviceDetails.model ? "red" : null,
      },
      {
        fieldName: "Market Name",
        fieldValue: marketName,
        valueColor:
          marketName !== initialDeviceDetails.marketName ? "red" : null,
      },
      {
        fieldName: "Type",
        fieldValue: deviceType,
        valueColor:
          deviceType !== initialDeviceDetails.deviceType ? "red" : null,
      },
      {
        fieldName: "Ticket ID",
        fieldValue: issueKey,
      },
    ]);
  }, [vendor, model, marketName, deviceType, summary]);

  useEffect(() => {
    if (confirmDetails) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <CreationStatusPopup
              status="Confirm Device Details"
              title="The following Device will be updated. Click OK to confirm"
              lineItems={deviceDetails}
              color="blue"
              onOk={() => {
                updateDevice(getFinalDeviceDetails(), issueKey);
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
      });
    }
  }, [confirmDetails]);

  useEffect(() => {
    if (creationStatus !== UNSTARTED) setSaveButton(false);

    creationStatus !== UNSTARTED &&
      confirmAlert({
        customUI: ({ onClose }) => {
          switch (creationStatus) {
            case STARTED:
              return (
                <CreationStatusPopup
                  status={
                    <>
                      {"UPDATING YOUR DEVICE    "}
                      <Spinner
                        animation="border"
                        style={{ height: "20px", width: "20px" }}
                      />
                    </>
                  }
                  title="Device Details: "
                  lineItems={deviceDetails}
                  color="blue"
                />
              );
            case SUCCESS:
              return (
                <CreationStatusPopup
                  status="SUCCESS!"
                  title="The following Device was successfully updated in Jira:"
                  lineItems={deviceDetails}
                  color="green"
                  footerTextLink={`Click here to access the Jira Capability (${issueKey})`}
                  footerLink={`${jiraTicketBaseURL}${issueKey}`}
                />
              );
            case ERROR:
              return (
                <CreationStatusPopup
                  status="ERROR!"
                  title="An error occured while creating a Device with the following details:"
                  lineItems={deviceDetails}
                  color="red"
                  footerTextNonLink="Please try again later"
                />
              );
          }
        },
        closeOnClickOutside: creationStatus !== STARTED,
        onClickOutside: () => {
          if (creationStatus === SUCCESS) {
            resetDeviceDetails();
            setVendor("");
            resetAll();
            setResetValue(true);
          } else if (creationStatus === ERROR) {
            resetCreationStatus();
          }
        },
      });
  }, [creationStatus]);

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
                setVendor(vendor);
                getDevicesForVendor(vendor);
                resetDeviceDetails();
                setResetValue(true);
                setModified();
              }}
              placeholder="Vendor"
              disabled={
                vendorList.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={vendor}
            />
          </FormItem>

          <FormItem>
            <span className="item-selection-headings">Select Device</span>
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
                let localDevice = devicesForVendor.find((d) => {
                  return d.model === model;
                });

                let localMarketName = localDevice?.marketName ?? "";
                let localDeviceType = localDevice?.type;
                let localSummary = localDevice?.summary;

                setIssueKey(localDevice?.key);

                setInitialDeviceDetails({
                  summary: localSummary,
                  model,
                  marketName: localMarketName,
                  deviceType: localDeviceType,
                });

                setModel(model);
                setMarketName(localMarketName);
                setDeviceType(localDeviceType);
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Device Model"
              }
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              // initialValue={model}
              resetValue={resetValue}
            />
          </FormItem>
        </LongFormItem>

        <FormItem>
          <span className="item-selection-headings">Select Device Type</span>
          <DropdownMenu
            itemList={deviceTypes.map((deviceType) => {
              return { name: deviceType.name, value: deviceType.name };
            })}
            onSelect={(device) => {
              if (modulesAndIoTDevices.includes(device)) setMarketName("");

              setDeviceType(device);
            }}
            placeholder={model !== "" ? "Device Type" : ""}
            disabled={!initialDeviceDetails.model}
            initialValue={deviceType}
            resetValue={deviceType === ""}
          />
        </FormItem>
        <FormItem>
          <span className="item-selection-headings">Enter Device Model</span>
          <TextInputField
            className="jira-input-box"
            onRead={(name) => {
              setModel(name);
              if (marketNameCheckBox) setMarketName(name);
            }}
            disabled={deviceType === ""}
            initialValue={model}
          />
        </FormItem>
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">
              Enter Device Market Name
            </span>
            <TextInputField
              placeholder={model !== "" ? "Device Market Name" : ""}
              className="jira-input-box"
              onRead={setMarketName}
              disabled={
                !initialDeviceDetails.model ||
                modulesAndIoTDevices.includes(deviceType)
              }
              initialValue={
                modulesAndIoTDevices.includes(deviceType) ? "" : marketName
              }
              readOnly={marketNameCheckBox}
            />
          </FormItem>
          <input
            type="checkbox"
            style={{
              alignSelf: "center",
              marginTop: "10px",
            }}
            onChange={handleMarketNameCheckBox}
            checked={marketNameCheckBox}
            disabled={model === "" || modulesAndIoTDevices.includes(deviceType)}
          />
          <span
            style={{
              alignSelf: "center",
              marginLeft: "10px",
              marginTop: "10px",
              fontStyle: "italic",
            }}
          >
            Use device model as market name
          </span>
        </LongFormItem>
      </div>
      <div className="jira-work-section-buttons-section">
        <Button
          variant={"primary"}
          className="jira-work-section-buttons"
          size="lg"
          key={"update"}
          disabled={!saveButton}
          onClick={() => {
            setConfirmDetails(true);
          }}
        >
          {"UPDATE"}
        </Button>
        <Button
          variant={"danger"}
          className="jira-work-section-buttons"
          size="lg"
          key={"discard"}
          disabled={!checkIfChanged()}
          onClick={resetDeviceDetailsToInitial}
        >
          {"RESET ALL"}
        </Button>
      </div>
    </div>
  );
};

export default JiraDeviceEditForm;
