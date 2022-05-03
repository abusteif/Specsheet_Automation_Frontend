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
  resetCreationStatus,
  backendRequestStatus,
  resetAll,
}) => {
  const [resetValueAll, setResetValueAll] = useState(false);
  const [resetValueRelease, setResetValueRelease] = useState(false);
  const [iotCycleDetails, setIotCycleDetails] = useState([]);
  const [summary, setSummary] = useState("");
  const [saveButton, setSaveButton] = useState(false);

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
    let bau = 0;
    if (selectedRelease)
      bau =
        releasesForDevice?.find((release) => {
          return release.key === selectedRelease;
        })?.bau + 1;
    let mrNum;
    if (releasesForDevice.length == 1) mrNum = "NR";
    if (releasesForDevice.length > 1)
      mrNum = "MR" + releasesForDevice.length - 1;
    setSummary(`${selectedVendor} ${selectedModel} - ${mrNum}.IOT${bau}`);

    console.log(summary);

    // setIotCycleDetails([
    //   { fieldName: "Summary", fieldValue: summary },
    //
    //   { fieldName: "Vendor", fieldValue: selectedVendor },
    //   { fieldName: "Model", fieldValue: selectedModel },
    //   {
    //     fieldName: "Epic Name",
    //     fieldValue: epicName,
    //   },
    //   {
    //     fieldName: "Testing Request Type",
    //     fieldValue: selectedTestingRequestType,
    //   },
    //   // {
    //   //   fieldName: "Testing Priority",
    //   //   fieldValue: selectedTestingPriority,
    //   // },
    //   {
    //     fieldName: "WDA Test Scope",
    //     fieldValue: selectedWDATestScope,
    //   },
    //   {
    //     fieldName: "Baseline Date",
    //     fieldValue:
    //       selectedBaselineDate &&
    //       `${selectedBaselineDate.getDate()}-${
    //         selectedBaselineDate.getMonth() + 1
    //       }-${selectedBaselineDate.getFullYear()}`,
    //   },
    //   {
    //     fieldName: "Funding",
    //     fieldValue: selectedFunding,
    //   },
    //   {
    //     fieldName: "Change Description",
    //     fieldValue: selectedChangeDescription,
    //   },
    // ]);
  }, [
    selectedVendor,
    selectedModel,
    selectedPlannedStartDate,
    selectedPlannedDeliveryDate,
  ]);

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
                resetReleasesForDevice();
                selectRelease("");
                selectModel("");
                getDevicesForVendor(vendor);
                selectVendor(vendor);
                setResetValueAll(true);
              }}
              placeholder="Vendor"
              disabled={vendorList.length === 0}
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
                getReleasesForDevice(getKeyForModel(devicesForVendor, model));
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Device Model"
              }
              disabled={devicesForVendor.length === 0}
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
          onClick={() => {}}
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
