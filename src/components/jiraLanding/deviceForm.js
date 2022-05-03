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
const JiraDeviceForm = ({
  getVendors,
  vendorList,
  selectVendor,
  selectedVendor,
  selectAsset,
  selectModel,
  selectedModel,
  selectMarketName,
  selectedMarketName,
  getDeviceTypes,
  deviceTypes,
  selectDeviceType,
  selectedDeviceType,
  createDevice,
  creationStatus,
  newCreatedKey,
  resetCreationStatus,
  getDevicesForVendor,
  resetAll,
  modified,
}) => {
  const [saveButton, setSaveButton] = useState(false);
  const [summary, setSummary] = useState("");
  const [marketNameCheckBox, setMarketNameCheckBox] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState([]);

  const modulesAndIoTDevices = [
    "LTE Modules",
    "5G Modules",
    "Integrated Device",
  ];
  const handleMarketNameCheckBox = (event) => {
    if (event.currentTarget.checked) {
      setMarketNameCheckBox(true);
      selectMarketName(selectedModel);
    }
    if (!event.currentTarget.checked) {
      selectMarketName("");
      setMarketNameCheckBox(false);
    }
  };

  // useEffect(() => {
  //   console.log("reset");
  //   return () => {
  //     console.log("resetting all");
  //     resetAll();
  //   };
  // }, []);

  useEffect(() => {
    if (deviceTypes.length === 0) getDeviceTypes();
  }, [deviceTypes]);

  useEffect(() => {
    if (creationStatus !== UNSTARTED) resetCreationStatus();
    if (!selectedVendor || !selectedModel || !selectedDeviceType)
      setSaveButton(false);
    else {
      if (modulesAndIoTDevices.includes(selectedDeviceType)) {
        setSaveButton(true);
        setSummary(`${selectedVendor} ${selectedModel} (N/A)`);
      } else {
        if (selectedMarketName) {
          setSaveButton(true);
          setSummary(
            `${selectedVendor} ${selectedModel} (${selectedMarketName})`
          );
        } else {
          setSaveButton(false);
        }
      }
    }
    setDeviceDetails([
      { fieldName: "Summary", fieldValue: summary },

      { fieldName: "Vendor", fieldValue: selectedVendor },
      { fieldName: "Model", fieldValue: selectedModel },
      {
        fieldName: "Market Name",
        fieldValue: selectedMarketName,
      },
      {
        fieldName: "Type",
        fieldValue: selectedDeviceType,
      },
    ]);
  }, [
    selectedVendor,
    selectedModel,
    selectedMarketName,
    selectedDeviceType,
    summary,
  ]);

  useEffect(() => {
    if (confirmDetails) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <CreationStatusPopup
              status="Confirm Device Details"
              title="The following device will be created. Click OK to confirm"
              lineItems={deviceDetails}
              color="blue"
              onOk={() => {
                createDevice({
                  summary,
                  issueType: "device",
                  vendor: selectedVendor,
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
      });
    }
  }, [confirmDetails]);

  useEffect(() => {
    if (creationStatus !== UNSTARTED) setSaveButton(false);
    if (creationStatus === SUCCESS) getDevicesForVendor(selectedVendor);

    creationStatus !== UNSTARTED &&
      confirmAlert({
        customUI: ({ onClose }) => {
          switch (creationStatus) {
            case STARTED:
              return (
                <CreationStatusPopup
                  status={
                    <>
                      {"CREATING YOUR DEVICE    "}
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
                  title="The following device was successfully created in Jira:"
                  lineItems={deviceDetails}
                  color="green"
                  footerTextLink="Click here to access the Jira ticket"
                  footerLink={`${jiraTicketBaseURL}${newCreatedKey}`}
                  footerTextNonLink="Would you like to create a Release associated with this device?"
                  onOk={() => {
                    selectAsset("Release");
                    selectModel(`${selectedModel} (${selectedMarketName})`);
                    resetCreationStatus();
                    onClose();
                  }}
                  okText="Create Release"
                  onCancel={() => {
                    onClose();
                  }}
                />
              );
            case ERROR:
              return (
                <CreationStatusPopup
                  status="ERROR!"
                  title="An error occured while creating a device with the following details:"
                  lineItems={deviceDetails}
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

  return (
    <div className="jira-work-section-body">
      <div className="jira-work-section-options-section">
        <FormItem>
          <span className="item-selection-headings">Select Vendor</span>
          <DropdownMenu
            itemList={vendorList.map((vendor) => {
              return { name: vendor.name, value: vendor.name };
            })}
            onSelect={selectVendor}
            placeholder="Vendor"
            disabled={vendorList.length === 0}
            initialValue={selectedVendor}
            resetValue={selectedVendor === ""}
          />
        </FormItem>
        <FormItem>
          <span className="item-selection-headings">Select Device Type</span>
          <DropdownMenu
            itemList={deviceTypes.map((deviceType) => {
              return { name: deviceType.name, value: deviceType.name };
            })}
            onSelect={(device) => {
              selectDeviceType(device);
              if (modulesAndIoTDevices.includes(device))
                selectMarketName("N/A");
              else selectMarketName("");
            }}
            placeholder={selectedModel !== "" ? "Device Type" : ""}
            disabled={selectedVendor === ""}
            initialValue={selectedDeviceType}
            resetValue={selectedDeviceType === ""}
          />
        </FormItem>
        <FormItem>
          <span className="item-selection-headings">Enter Device Model</span>
          <TextInputField
            placeholder={selectedVendor !== "" ? "Device Model" : ""}
            className="jira-input-box"
            onRead={(name) => {
              selectModel(name);
              if (marketNameCheckBox) selectMarketName(name);
            }}
            disabled={selectedDeviceType === ""}
            initialValue={selectedModel}
          />
        </FormItem>
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">
              Enter Device Market Name
            </span>
            <TextInputField
              placeholder={selectedModel !== "" ? "Device Market Name" : ""}
              className="jira-input-box"
              onRead={selectMarketName}
              disabled={
                selectedModel === "" ||
                modulesAndIoTDevices.includes(selectedDeviceType)
              }
              initialValue={
                modulesAndIoTDevices.includes(selectedDeviceType)
                  ? ""
                  : selectedMarketName
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
            disabled={
              selectedModel === "" ||
              modulesAndIoTDevices.includes(selectedDeviceType)
            }
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
          key={"save"}
          disabled={
            !saveButton
            // selectedDeviceType === "" || creationStatus !== UNSTARTED
          }
          onClick={() => {
            // let summary = `${selectedVendor} ${selectedModel} ${
            //   selectedMarketName ? `(${selectedMarketName})` : ""
            // }`;
            // createDevice({
            //   summary,
            //   issueType: "device",
            //   vendor: selectedVendor,
            // });
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

export default JiraDeviceForm;
