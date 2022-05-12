import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { confirmAlert } from "react-confirm-alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-datepicker";
import DropdownMenu from "../../theme/dropdownMenu";
import FormItem from "../../theme/formItem";
import LongFormItem from "../../theme/longFormItem";
import TextInputField from "../../theme/textInputField";
import CreationStatusPopup from "./creationStatusPopup";
import Popup from "../../theme/popup";

import "react-datepicker/dist/react-datepicker.css";
import "../../styling/theme/datePicker.css";

import {
  SUCCESS,
  ERROR,
  UNSTARTED,
  STARTED,
} from "../../configs/configurations";
import { jiraTicketBaseURL } from "../../configs/staticData";
var _ = require("lodash");

const JiraIotCycleForm = ({
  resetDevicesForVendorList,
  getDevicesForVendor,
  vendorList,
  selectVendor,
  selectedVendor,
  devicesForVendor,
  selectModel,
  selectedModel,
  selectPlannedStartDate,
  selectPlannedDeliveryDate,
  selectedPlannedStartDate,
  selectedPlannedDeliveryDate,
  getReleasesForDevice,
  selectRelease,
  selectedRelease,
  releasesForDevice,
  resetReleasesForDevice,
  createIOTCycle,
  modified,
  creationStatus,
  newCreatedKey,

  resetCreationStatus,
  backendRequestStatus,
  resetAll,
}) => {
  const [resetValueAll, setResetValueAll] = useState(false);
  const [resetValueRelease, setResetValueRelease] = useState(false);
  const [iotCycleDetails, setIotCycleDetails] = useState([]);
  const [summary, setSummary] = useState("");
  const [saveButton, setSaveButton] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [bau, setBau] = useState(false);

  useEffect(() => {
    if (selectedRelease)
      setBau(
        releasesForDevice?.find((release) => {
          return release.key === selectedRelease;
        })?.bau + 1
      );
  }, [selectedRelease]);
  useEffect(() => {
    if (creationStatus !== UNSTARTED) resetCreationStatus();
    if (
      !selectedVendor ||
      !selectedModel ||
      !selectedPlannedStartDate ||
      !selectedPlannedDeliveryDate
    )
      setSaveButton(false);
    else {
      setSaveButton(true);
    }

    let mrNum;
    if (releasesForDevice.length == 1) mrNum = "NR";
    if (releasesForDevice.length > 1)
      mrNum = "MR" + (releasesForDevice.length - 1);
    setSummary(`${selectedVendor} ${selectedModel} - ${mrNum}.IOT${bau}`);

    setIotCycleDetails([
      { fieldName: "Summary", fieldValue: summary },

      { fieldName: "Vendor", fieldValue: selectedVendor },
      { fieldName: "Model", fieldValue: selectedModel },
      {
        fieldName: "Release",
        fieldValue: _.find(releasesForDevice, { key: selectedRelease })?.name,
      },

      {
        fieldName: "Planned Start Date",
        fieldValue:
          selectedPlannedStartDate &&
          `${selectedPlannedStartDate.getDate()}-${
            selectedPlannedStartDate.getMonth() + 1
          }-${selectedPlannedStartDate.getFullYear()}`,
      },
      {
        fieldName: "Planned Delivery Date",
        fieldValue:
          selectedPlannedDeliveryDate &&
          `${selectedPlannedDeliveryDate.getDate()}-${
            selectedPlannedDeliveryDate.getMonth() + 1
          }-${selectedPlannedDeliveryDate.getFullYear()}`,
      },
    ]);
  }, [
    selectedVendor,
    selectedModel,
    selectedRelease,
    selectedPlannedStartDate,
    selectedPlannedDeliveryDate,
  ]);

  useEffect(() => {
    if (confirmDetails) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <CreationStatusPopup
              status="Confirm IOT Cycle Details"
              title="The following IOT Cycle will be created. Click OK to confirm"
              lineItems={iotCycleDetails}
              color="blue"
              onOk={() => {
                createIOTCycle({
                  summary: summary,
                  epicLink: selectedRelease,

                  plannedStartDate: `${selectedPlannedStartDate.getFullYear()}-${
                    selectedPlannedStartDate.getMonth() + 1
                  }-${selectedPlannedStartDate.getDate()}`,

                  plannedDeliveryDate: `${selectedPlannedDeliveryDate.getFullYear()}-${
                    selectedPlannedDeliveryDate.getMonth() + 1
                  }-${selectedPlannedDeliveryDate.getDate()}`,
                  bau,
                  vendor: selectedVendor,
                  issueType: "iotCycle",
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
    // if (creationStatus === SUCCESS) {
    //   getReleasesForDevice(getKeyForModel(devicesForVendor, selectedModel));
    //   // console.log(newCreatedKey);
    //   selectRelease(newCreatedKey);
    // }

    creationStatus !== UNSTARTED &&
      confirmAlert({
        customUI: ({ onClose }) => {
          switch (creationStatus) {
            case STARTED:
              return (
                <CreationStatusPopup
                  status={
                    <>
                      {"CREATING YOUR IOT CYCLE  "}
                      <Spinner
                        animation="border"
                        style={{ height: "20px", width: "20px" }}
                      />
                    </>
                  }
                  title="IOT Cycle Details: "
                  lineItems={iotCycleDetails}
                  color="blue"
                />
              );
            case SUCCESS:
              return (
                <CreationStatusPopup
                  status="SUCCESS!"
                  title="The following IOT Cycle was successfully created in Jira:"
                  lineItems={iotCycleDetails}
                  color="green"
                  footerTextLink={`Click here to access the Jira Story (${newCreatedKey})`}
                  footerLink={`${jiraTicketBaseURL}${newCreatedKey}`}
                />
              );
            case ERROR:
              return (
                <CreationStatusPopup
                  status="ERROR!"
                  title="An error occured while creating an IOT Cycle with the following details:"
                  lineItems={iotCycleDetails}
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
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">Select Vendor</span>
            <DropdownMenu
              itemList={vendorList.map((vendor) => {
                return { name: vendor.name, value: vendor.name };
              })}
              onSelect={(vendor) => {
                resetDevicesForVendorList();
                resetReleasesForDevice();
                selectRelease("");
                selectModel("");
                getDevicesForVendor(vendor);
                selectVendor(vendor);
                selectPlannedDeliveryDate("");
                selectPlannedStartDate("");
                setResetValueAll(true);
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
                <span className="missing-item-error">
                  No devices found for the selected Vendor
                </span>
              )}
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">Select Device Model</span>
            <DropdownMenu
              itemList={devicesForVendor.map((device) => {
                return { name: device.model, value: device.model };
              })}
              onSelect={(model) => {
                setResetValueAll(false);
                setResetValueRelease(true);
                selectRelease("");
                resetReleasesForDevice();
                selectModel(model);
                selectPlannedDeliveryDate("");
                selectPlannedStartDate("");

                // getReleasesForDevice(getKeyForModel(devicesForVendor, model));
                getReleasesForDevice(
                  _.find(devicesForVendor, { model: model })?.key
                );
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Device Model"
              }
              disabled={
                devicesForVendor.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={selectedModel}
              resetValue={resetValueAll}
              longItem={true}
            />
            {selectedModel &&
              releasesForDevice.length === 0 &&
              backendRequestStatus !== STARTED && (
                <span className="missing-item-error">
                  No releases found for selected device
                </span>
              )}
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">Select Release</span>
            <DropdownMenu
              itemList={releasesForDevice.map((release) => {
                return {
                  name: release.name,
                  value: release.key,
                };
              })}
              onSelect={(release) => {
                setResetValueRelease(false);
                selectRelease(release);
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Release"
              }
              disabled={releasesForDevice.length === 0}
              initialValue={selectedRelease}
              resetValue={resetValueRelease || resetValueAll}
              longItem={true}
            />
          </FormItem>
        </LongFormItem>

        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">
              Select Planned Start Date
            </span>
            <div className="customDatePickerWidth">
              <DatePicker
                disabled={!selectedRelease}
                onChange={(e) => {
                  selectPlannedStartDate(e);
                  selectPlannedDeliveryDate("");
                }}
                selected={selectedPlannedStartDate}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">
              Select Planned Delivery Date
            </span>
            <div className="customDatePickerWidth">
              <DatePicker
                disabled={!selectedRelease || !selectedPlannedStartDate}
                onChange={(e) => {
                  selectPlannedDeliveryDate(e);
                }}
                selected={selectedPlannedDeliveryDate}
                dateFormat="dd/MM/yyyy"
                minDate={selectedPlannedStartDate}
              />
            </div>
          </FormItem>
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

export default JiraIotCycleForm;
