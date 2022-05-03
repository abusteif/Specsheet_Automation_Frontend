import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Spinner from "react-bootstrap/Spinner";

import JiraDeviceForm from "./deviceForm";
import JiraReleaseForm from "./releaseForm";
import JiraIotCycleForm from "./iotCycleForm";

import KeyValueLine from "../../theme/keyValueLine";

import "../../styling/jiraLanding.css";

const JiraWorkSection = ({
  selectedOperation,
  selectAsset,
  selectedAsset,
  getVendors,
  vendorList,
  selectVendor,
  selectedVendor,
  selectModel,
  selectedModel,
  selectMarketName,
  selectedMarketName,
  getDeviceTypes,
  getDevicesForVendor,
  devicesForVendor,
  deviceTypes,
  selectDeviceType,
  selectedDeviceType,
  createDevice,
  creationStatus,
  newCreatedKey,
  testingRequestTypes,
  getTestingRequestTypes,
  selectedTestingRequestType,
  selectTestingRequestType,
  resetCreationStatus,
  resetDevicesForVendorList,
  // getTestingPriorities,
  // testingPriorities,
  // selectTestingPriority,
  // selectedTestingPriority,
  getWDATestScopes,
  selectWDATestScope,
  wdaTestScopes,
  selectedWDATestScope,
  getFunding,
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
  selectPlannedStartDate,
  selectPlannedDeliveryDate,
  selectedPlannedStartDate,
  selectedPlannedDeliveryDate,
  getReleasesForDevice,
  releasesForDevice,
  selectedRelease,
  selectRelease,
  resetReleasesForDevice,
  createRelease,
  createIOTCycle,
  loginDetails,
  ready,
  backendRequestStatus,
  modified,
  resetAll,
}) => {
  useEffect(() => {}, [ready, selectedOperation, selectedAsset]);
  useEffect(() => {
    if (vendorList.length === 0) getVendors();
  }, [vendorList]);
  useEffect(() => {
    if (testingRequestTypes.length === 0) getTestingRequestTypes();
  }, [testingRequestTypes]);

  // useEffect(() => {
  //   if (testingPriorities.length === 0) getTestingPriorities();
  // }, [testingPriorities]);

  useEffect(() => {
    if (wdaTestScopes.length === 0) getWDATestScopes();
  }, [wdaTestScopes]);

  useEffect(() => {
    if (funding.length === 0) getFunding();
  }, [funding]);

  const helper = () => {
    switch (selectedAsset) {
      case "Device":
        return (
          <JiraDeviceForm
            getVendors={getVendors}
            vendorList={vendorList}
            selectAsset={selectAsset}
            selectedVendor={selectedVendor}
            selectVendor={selectVendor}
            selectModel={selectModel}
            selectedModel={selectedModel}
            selectMarketName={selectMarketName}
            selectedMarketName={selectedMarketName}
            getDeviceTypes={getDeviceTypes}
            deviceTypes={deviceTypes}
            selectDeviceType={selectDeviceType}
            selectedDeviceType={selectedDeviceType}
            createDevice={createDevice}
            creationStatus={creationStatus}
            newCreatedKey={newCreatedKey}
            getDevicesForVendor={getDevicesForVendor}
            modified={modified}
            resetCreationStatus={resetCreationStatus}
            resetAll={resetAll}
          />
        );
      case "Release":
        return (
          <JiraReleaseForm
            vendorList={vendorList}
            getDevicesForVendor={getDevicesForVendor}
            devicesForVendor={devicesForVendor}
            selectVendor={selectVendor}
            selectedVendor={selectedVendor}
            selectModel={selectModel}
            selectedModel={selectedModel}
            resetDevicesForVendorList={resetDevicesForVendorList}
            testingRequestTypes={testingRequestTypes}
            // testingPriorities={testingPriorities}
            selectedTestingRequestType={selectedTestingRequestType}
            selectTestingRequestType={selectTestingRequestType}
            // selectTestingPriority={selectTestingPriority}
            // selectedTestingPriority={selectedTestingPriority}
            selectWDATestScope={selectWDATestScope}
            wdaTestScopes={wdaTestScopes}
            selectedWDATestScope={selectedWDATestScope}
            selectFunding={selectFunding}
            selectedFunding={selectedFunding}
            funding={funding}
            modified={modified}
            creationStatus={creationStatus}
            resetCreationStatus={resetCreationStatus}
            selectBaselineDate={selectBaselineDate}
            selectActualDate={selectActualDate}
            selectedBaselineDate={selectedBaselineDate}
            selectedActualDate={selectedActualDate}
            selectBAUNumberselectBAUNumber
            selectedBAUNumber={selectedBAUNumber}
            selectChangeDescription={selectChangeDescription}
            selectedChangeDescription={selectedChangeDescription}
            getReleasesForDevice={getReleasesForDevice}
            createRelease={createRelease}
            selectRelease={selectRelease}
            newCreatedKey={newCreatedKey}
            selectAsset={selectAsset}
            loginDetails={loginDetails}
            backendRequestStatus={backendRequestStatus}
            resetAll={resetAll}
          />
        );
      case "IOT Cycle":
        return (
          <JiraIotCycleForm
            resetDevicesForVendorList={resetDevicesForVendorList}
            getDevicesForVendor={getDevicesForVendor}
            vendorList={vendorList}
            selectVendor={selectVendor}
            selectModel={selectModel}
            selectedModel={selectedModel}
            selectRelease={selectRelease}
            devicesForVendor={devicesForVendor}
            selectedVendor={selectedVendor}
            selectPlannedStartDate={selectPlannedStartDate}
            selectPlannedDeliveryDate={selectPlannedDeliveryDate}
            selectedPlannedStartDate={selectedPlannedStartDate}
            selectedPlannedDeliveryDate={selectedPlannedDeliveryDate}
            getReleasesForDevice={getReleasesForDevice}
            selectRelease={selectRelease}
            selectedRelease={selectedRelease}
            releasesForDevice={releasesForDevice}
            resetCreationStatus={resetCreationStatus}
            resetReleasesForDevice={resetReleasesForDevice}
            createIOTCycle={createIOTCycle}
            creationStatus={creationStatus}
            modified={modified}
            backendRequestStatus={backendRequestStatus}
            resetAll={resetAll}
          />
        );
    }
  };

  return (
    <div className="jira-work-section">
      {selectedOperation && selectedAsset && (
        <>
          <div className="jira-work-section-header">
            <KeyValueLine
              keyProp={`${selectedOperation} ${selectedAsset}`}
              valueProp={`${selectedVendor} ${selectedModel} ${
                selectedMarketName ? `(${selectedMarketName})` : ""
              }`}
            />
          </div>
          <div
            className="border-shadow-bottom"
            style={{
              marginTop: "20px",
              alignSelf: "center",
              width: "70%",
            }}
          />{" "}
        </>
      )}
      {helper()}
    </div>
  );
};

export default JiraWorkSection;
