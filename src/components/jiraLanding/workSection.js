import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Spinner from "react-bootstrap/Spinner";

import JiraDeviceCreateForm from "./deviceCreateForm";
import JiraDeviceEditForm from "./deviceEditForm";
import JiraReleaseForm from "./releaseForm";
import JiraReleaseEditForm from "./releaseEditForm";
import JiraIotCycleForm from "./iotCycleForm";
import JiraDefectForm from "./defectForm";

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
  updateDevice,
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
  createDefect,
  loginDetails,
  ready,
  backendRequestStatus,
  modified,
  setModified,
  resetAll,
}) => {
  useEffect(() => {}, [ready, selectedOperation, selectedAsset]);

  useEffect(() => {
    if (deviceTypes.length === 0) getDeviceTypes();
  }, [deviceTypes]);

  useEffect(() => {
    if (vendorList.length === 0) getVendors();
  }, [vendorList]);

  useEffect(() => {
    if (testingRequestTypes.length === 0) getTestingRequestTypes();
  }, [testingRequestTypes]);

  useEffect(() => {
    if (wdaTestScopes.length === 0) getWDATestScopes();
  }, [wdaTestScopes]);

  useEffect(() => {
    if (funding.length === 0) getFunding();
  }, [funding]);

  const helper = () => {
    switch (selectedAsset) {
      case "Device":
        return selectedOperation === "Create" ? (
          <JiraDeviceCreateForm
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
            devicesForVendor={devicesForVendor}
            modified={modified}
            resetCreationStatus={resetCreationStatus}
            backendRequestStatus={backendRequestStatus}
            resetAll={resetAll}
          />
        ) : (
          <JiraDeviceEditForm
            getVendors={getVendors}
            vendorList={vendorList}
            getDeviceTypes={getDeviceTypes}
            deviceTypes={deviceTypes}
            creationStatus={creationStatus}
            getDevicesForVendor={getDevicesForVendor}
            devicesForVendor={devicesForVendor}
            updateDevice={updateDevice}
            resetCreationStatus={resetCreationStatus}
            backendRequestStatus={backendRequestStatus}
            setModified={setModified}
            resetAll={resetAll}
          />
        );
      case "Release":
        return selectedOperation === "Create" ? (
          <JiraReleaseForm
            vendorList={vendorList}
            getDevicesForVendor={getDevicesForVendor}
            devicesForVendor={devicesForVendor}
            selectVendor={selectVendor}
            selectedVendor={selectedVendor}
            selectModel={selectModel}
            selectedModel={selectedModel}
            selectedMarketName={selectedMarketName}
            getDeviceTypes={getDeviceTypes}
            deviceTypes={deviceTypes}
            selectDeviceType={selectDeviceType}
            selectedDeviceType={selectedDeviceType}
            resetDevicesForVendorList={resetDevicesForVendorList}
            testingRequestTypes={testingRequestTypes}
            selectedTestingRequestType={selectedTestingRequestType}
            selectTestingRequestType={selectTestingRequestType}
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
            selectChangeDescription={selectChangeDescription}
            selectedChangeDescription={selectedChangeDescription}
            getReleasesForDevice={getReleasesForDevice}
            releasesForDevice={releasesForDevice}
            createRelease={createRelease}
            selectRelease={selectRelease}
            selectMarketName={selectMarketName}
            newCreatedKey={newCreatedKey}
            selectAsset={selectAsset}
            loginDetails={loginDetails}
            backendRequestStatus={backendRequestStatus}
            resetAll={resetAll}
          />
        ) : (
          <JiraReleaseEditForm
            vendorList={vendorList}
            getDevicesForVendor={getDevicesForVendor}
            devicesForVendor={devicesForVendor}
            deviceTypes={deviceTypes}
            testingRequestTypes={testingRequestTypes}
            wdaTestScopes={wdaTestScopes}
            fundingList={funding}
            modified={modified}
            creationStatus={creationStatus}
            resetCreationStatus={resetCreationStatus}
            getReleasesForDevice={getReleasesForDevice}
            releasesForDevice={releasesForDevice}
            newCreatedKey={newCreatedKey}
            loginDetails={loginDetails}
            resetDevicesForVendorList={resetDevicesForVendorList}
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
            newCreatedKey={newCreatedKey}
            modified={modified}
            backendRequestStatus={backendRequestStatus}
            resetAll={resetAll}
          />
        );
      case "Defect":
        return (
          <JiraDefectForm
            createDefect={createDefect}
            resetCreationStatus={resetCreationStatus}
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
                selectedVendor && selectedModel ? `(${selectedMarketName})` : ""
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
