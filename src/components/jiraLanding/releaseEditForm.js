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
const JiraReleaseEditForm = ({
  vendorList,
  getDevicesForVendor,
  devicesForVendor,
  testingRequestTypes,
  creationStatus,
  resetCreationStatus,
  resetDevicesForVendorList,
  wdaTestScopes,
  getReleasesForDevice,
  releasesForDevice,
  loginDetails,
  resetAll,
  fundingList,
  backendRequestStatus,
  modified,
}) => {
  const [saveButton, setSaveButton] = useState(false);
  const [resetValue, setResetValue] = useState(false);
  const [summary, setSummary] = useState("");
  const [epicName, setEpicName] = useState("");
  const [confirmDetails, setConfirmDetails] = useState(false);
  const [releaseDetails, setReleaseDetails] = useState([]);

  const [vendor, setVendor] = useState("");
  const [model, setModel] = useState("");
  const [testingRequestType, setTestingRequestType] = useState("");
  const [baselineDate, setBaselineDate] = useState("");
  const [funding, setFunding] = useState("");
  const [wdaTestScope, setWdaTestScope] = useState("");
  const [changeDescription, setChangeDescription] = useState("");
  const [release, setRelease] = useState("");
  const [resetValueRelease, setResetValueRelease] = useState(false);
  const [issueKey, setIssueKey] = useState("");

  const initialReleaseDetailsObject = {
    testingRequestType: "",
    baselineDate: "",
    funding: "",
    wdaTestScope: "",
    changeDescription: "",
    epicName: "",
  };

  const [initialReleaseDetails, setInitialReleaseDetails] = useState({
    ...initialReleaseDetailsObject,
  });

  const checkIfChanged = () => {
    return (
      testingRequestType !== initialReleaseDetails.testingRequestType ||
      baselineDate.getTime() !== initialReleaseDetails.baselineDate.getTime() ||
      funding !== initialReleaseDetails.funding ||
      wdaTestScope !== initialReleaseDetails.wdaTestScope ||
      changeDescription !== initialReleaseDetails.changeDescription
    );
  };

  const resetReleaseDetails = () => {
    setTestingRequestType("");
    setWdaTestScope("");
    setFunding("");
    setBaselineDate("");
    setChangeDescription("");
    setIssueKey("");
    setInitialReleaseDetails({ ...initialReleaseDetailsObject });
  };

  useEffect(() => {
    if (creationStatus !== UNSTARTED) resetCreationStatus();

    if (
      !testingRequestType ||
      !baselineDate ||
      !funding ||
      !wdaTestScope ||
      !checkIfChanged() ||
      (testingRequestType !== "WDA_New Device Testing" && !changeDescription)
    )
      setSaveButton(false);
    else {
      setSaveButton(true);
    }

    let localEpicName;

    if (testingRequestType !== initialReleaseDetails.testingRequestType) {
      localEpicName = `${vendor} ${model}_`;
      if (
        testingRequestType === "WDA_New Device Testing" &&
        initialReleaseDetails.testingRequestType !== "WDA_New Device Testing"
      )
        localEpicName = localEpicName + `WDA_New Device Testing`;
      else if (
        testingRequestType !== "WDA_New Device Testing" &&
        initialReleaseDetails.testingRequestType === "WDA_New Device Testing"
      ) {
        if (releasesForDevice.length > 0) {
          localEpicName = localEpicName + "MR" + releasesForDevice.length;
        } else {
          localEpicName = localEpicName + "MR";
        }
      }
    } else {
      localEpicName = initialReleaseDetails.epicName;
    }
    setEpicName(localEpicName);

    setReleaseDetails([
      { fieldName: "Summary", fieldValue: summary },

      { fieldName: "Vendor", fieldValue: vendor },
      { fieldName: "Model", fieldValue: model },
      {
        fieldName: "Epic Name",
        fieldValue: localEpicName,
        valueColor:
          localEpicName !== initialReleaseDetails.epicName ? "red" : null,
      },
      {
        fieldName: "Testing Request Type",
        fieldValue: testingRequestType,
        valueColor:
          testingRequestType !== initialReleaseDetails.testingRequestType
            ? "red"
            : null,
      },
      {
        fieldName: "WDA Test Scope",
        fieldValue: wdaTestScope,
        valueColor:
          wdaTestScope !== initialReleaseDetails.wdaTestScope ? "red" : null,
      },
      {
        fieldName: "Baseline Date",
        fieldValue:
          baselineDate &&
          `${baselineDate.getDate()}-${
            baselineDate.getMonth() + 1
          }-${baselineDate.getFullYear()}`,
        valueColor:
          baselineDate &&
          baselineDate?.getTime() !==
            initialReleaseDetails?.baselineDate?.getTime()
            ? "red"
            : null,
      },
      {
        fieldName: "Funding",
        fieldValue: funding,
        valueColor: funding !== initialReleaseDetails.funding ? "red" : null,
      },
      {
        fieldName: "Change Description",
        fieldValue: changeDescription,
        valueColor:
          changeDescription !== initialReleaseDetails.changeDescription
            ? "red"
            : null,
      },
    ]);
  }, [
    vendor,
    model,
    testingRequestType,
    baselineDate,
    funding,
    wdaTestScope,
    changeDescription,
    releasesForDevice,
    // epicName,
  ]);

  useEffect(() => {
    if (confirmDetails) {
      confirmAlert({
        customUI: ({ onClose }) => {
          const deviceModel = model.split("(")[0].trim();
          return (
            <CreationStatusPopup
              status="Confirm Release Details"
              title="The following Release will be created. Click OK to confirm"
              lineItems={releaseDetails}
              color="blue"
              onOk={() => {
                // createRelease({
                //   epicName: epicName,
                //   summary: summary,
                //   testingRequestType: testingRequestType,
                //   // testingPriority: selectedTestingPriority,
                //   wdaTestScope: wdaTestScope,
                //   parentLink: devicesForVendor.find((item) => {
                //     return item.model === model;
                //   }).key,
                //   baselineDate: `${baselineDate.getFullYear()}-${
                //     baselineDate.getMonth() + 1
                //   }-${baselineDate.getDate()}`,
                //   changeDescription: changeDescription,
                //   funding: funding,
                //   issueType: "release",
                //   vendor: vendor,
                //   deviceModel: deviceModel,
                //   deviceType: deviceType,
                // });
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
      getReleasesForDevice(getKeyForModel(devicesForVendor, model));
      // console.log(newCreatedKey);
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
                  footerTextLink={`Click here to access the Jira Epic (${issueKey})`}
                  footerLink={`${jiraTicketBaseURL}${issueKey}`}
                  footerTextNonLink="Would you like to create an IOT Cycle associated with this Release?"
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
                resetReleaseDetails();
                setVendor(vendor);
                setResetValue(true);
              }}
              placeholder="Vendor"
              disabled={
                vendorList.length === 0 || backendRequestStatus == STARTED
              }
              initialValue={vendor}
              resetValue={!modified}
            />
            {vendor &&
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
                setModel(model);
                setRelease("");
                resetReleaseDetails();
                getReleasesForDevice(getKeyForModel(devicesForVendor, model), [
                  "funding",
                  "changeDescription",
                  "wdaTestScope",
                  "baselineDate",
                  "summary",
                  "deviceType",
                ]);
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Device Model"
              }
              disabled={!vendor || backendRequestStatus == STARTED}
              initialValue={model}
              resetValue={resetValue}
            />
            {vendor &&
              model &&
              releasesForDevice.length === 0 &&
              backendRequestStatus !== STARTED && (
                <span
                  style={{
                    fontStyle: "italic",
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  No releases found for the selected device
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
                setRelease(release);
                let localRelease = releasesForDevice.find((r) => {
                  return r.key === release;
                });
                let localSummary = localRelease?.summary ?? "";
                let localDeviceType = localRelease?.deviceType ?? "";
                let localTestingRequestType =
                  localRelease?.testingRequestType ?? "";
                let localWdaTestScope = localRelease?.wdaTestScope ?? "";
                let localFunding = localRelease?.funding ?? "";
                let localBaselineDate =
                  new Date(localRelease?.baselineDate) ?? "";
                let localChangeDescription =
                  localRelease?.changeDescription ?? "";
                let localEpicName = localRelease?.name ?? "";

                setInitialReleaseDetails({
                  summary: localSummary,
                  deviceType: localDeviceType,
                  testingRequestType: localTestingRequestType,
                  wdaTestScope: localWdaTestScope,
                  funding: localFunding,
                  baselineDate: localBaselineDate,
                  changeDescription: localChangeDescription,
                  epicName: localEpicName,
                });
                setSummary(localSummary);
                setTestingRequestType(localTestingRequestType);
                setWdaTestScope(localWdaTestScope);
                setFunding(localFunding);
                setBaselineDate(new Date(localBaselineDate));
                setChangeDescription(localChangeDescription);
                setEpicName(localEpicName);
              }}
              placeholder={
                backendRequestStatus === STARTED ? "Loading.." : "Release"
              }
              disabled={
                !model ||
                releasesForDevice.length === 0 ||
                backendRequestStatus == STARTED
              }
              initialValue={release}
              resetValue={resetValueRelease || resetValue}
              longItem={true}
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
              onSelect={(requestType) => {
                setTestingRequestType(requestType);
              }}
              placeholder="Testing Request Type"
              disabled={!release || backendRequestStatus == STARTED}
              initialValue={testingRequestType}
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
                setWdaTestScope(scope);
              }}
              placeholder="WDA Test Scope"
              disabled={!release || backendRequestStatus == STARTED}
              initialValue={wdaTestScope}
              resetValue={!modified}
            />
          </FormItem>
        </LongFormItem>
        <LongFormItem>
          <FormItem>
            <span className="item-selection-headings">Select Funding</span>
            <DropdownMenu
              itemList={fundingList.map((fund) => {
                return { name: fund.name, value: fund.name };
              })}
              onSelect={(fund) => {
                setFunding(fund);
              }}
              placeholder="Funding"
              disabled={!release || backendRequestStatus == STARTED}
              initialValue={funding}
              resetValue={!modified}
            />
          </FormItem>
          <FormItem>
            <span className="item-selection-headings">
              Select Baseline TA Date
            </span>
            <div className="customDatePickerWidth">
              <DatePicker
                disabled={!release || backendRequestStatus == STARTED}
                onChange={(e) => {
                  setBaselineDate(e);
                }}
                selected={baselineDate}
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
              disabled={!release || backendRequestStatus == STARTED}
              maxLength={255}
              onBlur={setChangeDescription}
              initialValue={changeDescription}
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
          disabled={!saveButton}
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

export default JiraReleaseEditForm;
