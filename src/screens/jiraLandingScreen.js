import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import DropdownMenu from "../theme/dropdownMenu";
import Screen from "./screenTemplate";
import JiraOperationsTab from "../components/jiraLanding/operationsTab";
import JiraAssetsTab from "../components/jiraLanding/assetsTab";
import JiraWorkSection from "../components/jiraLanding/workSection";
import LoginScreen from "./loginScreen";
import { apiErrorMessage } from "../configs/staticData";

import {
  selectOperation,
  selectAsset,
  initialiseJira,
  getVendors,
  selectVendor,
  selectModel,
  selectMarketName,
  selectDeviceType,
  getDeviceTypes,
  getDevicesForVendor,
  createItem,
  resetCreationStatus,
  getTestingRequestTypes,
  selectTestingRequestType,
  // getTestingPriorities,
  // selectTestingPriority,
  getWDATestScopes,
  selectWDATestScope,
  getFunding,
  selectFunding,
  selectBaselineDate,
  selectActualDate,
  selectBAUNumber,
  selectChangeDescription,
  selectPlannedStartDate,
  selectPlannedDeliveryDate,
  getReleasesForDevice,
  selectRelease,
  resetReleasesForDevice,
  resetAll,
  resetDevicesForVendorList,
} from "../actions/jira-actions";
import { getProjectId, logout } from "../actions/common-actions";
import { jiraProjectKey } from "../configs/staticData";
import { LOGGEDIN } from "../configs/configurations";

const JiraLandingScreen = (props) => {
  useEffect(() => {
    if (!props.jira.projectId) {
      props.getProjectId(jiraProjectKey, "jira");
    }
    if (!props.jira.jiraInitiated && props.jira.projectId)
      props.initialiseJira(false, props.jira.projectId);
  }, [props.jira.projectId]);
  return props.common.loginStatus === LOGGEDIN ? (
    <Screen
      subMessage={
        !props.common.status && apiErrorMessage + props.common.errorMessage
      }
      login={props.common.loginDetails}
      logout={props.logout}
      loadingOverlayActive={!props.jira.projectId}
    >
      <JiraOperationsTab
        selectOperation={props.selectOperation}
        selectedOperation={props.jira.selectedOperation}
        resetAll={props.resetAll}
        modified={props.jira.modified}
      />
      <JiraAssetsTab
        selectedOperation={props.jira.selectedOperation}
        selectAsset={props.selectAsset}
        selectedAsset={props.jira.selectedAsset}
        resetAll={props.resetAll}
        modified={props.jira.modified}
      />
      <JiraWorkSection
        selectedOperation={props.jira.selectedOperation}
        selectAsset={props.selectAsset}
        selectedAsset={props.jira.selectedAsset}
        getVendors={() => props.getVendors(props.jira.projectId)}
        vendorList={props.jira.vendors}
        selectVendor={props.selectVendor}
        selectedVendor={props.jira.selectedVendor}
        selectModel={props.selectModel}
        selectedModel={props.jira.selectedModel}
        selectMarketName={props.selectMarketName}
        selectedMarketName={props.jira.selectedMarketName}
        getDeviceTypes={() => {
          props.getDeviceTypes(props.jira.projectId);
        }}
        getDevicesForVendor={(vendor) => {
          props.getDevicesForVendor(props.jira.projectId, vendor);
        }}
        devicesForVendor={props.jira.devicesForVendor}
        deviceTypes={props.jira.deviceTypes}
        selectDeviceType={props.selectDeviceType}
        selectedDeviceType={props.jira.selectedDeviceType}
        createDevice={(fields) => {
          props.createItem("device", {
            ...fields,
            projectId: props.jira.projectId,
            reporter: props.common.loginDetails.name,
          });
        }}
        creationStatus={props.jira.creationStatus}
        newCreatedKey={props.jira.newCreatedKey}
        getTestingRequestTypes={() => {
          props.getTestingRequestTypes(props.jira.projectId);
        }}
        selectedTestingRequestType={props.jira.selectedTestingRequestType}
        selectTestingRequestType={props.selectTestingRequestType}
        testingRequestTypes={props.jira.testingRequestTypes}
        resetCreationStatus={props.resetCreationStatus}
        resetDevicesForVendorList={props.resetDevicesForVendorList}
        // getTestingPriorities={() => {
        //   props.getTestingPriorities(props.jira.projectId);
        // }}
        // testingPriorities={props.jira.testingPriorities}
        // selectTestingPriority={props.selectTestingPriority}
        // selectedTestingPriority={props.jira.selectedTestingPriority}
        getWDATestScopes={() => {
          props.getWDATestScopes(props.jira.projectId);
        }}
        selectWDATestScope={props.selectWDATestScope}
        wdaTestScopes={props.jira.wdaTestScopes}
        selectedWDATestScope={props.jira.selectedWDATestScope}
        getFunding={() => {
          props.getFunding(props.jira.projectId);
        }}
        selectFunding={props.selectFunding}
        funding={props.jira.funding}
        selectedFunding={props.jira.selectedFunding}
        selectBaselineDate={props.selectBaselineDate}
        selectedBaselineDate={props.jira.selectedBaselineDate}
        selectActualDate={props.selectActualDate}
        selectedActualDate={props.jira.selectedActualDate}
        selectBAUNumber={props.selectBAUNumber}
        selectedBAUNumber={props.jira.selectedBAUNumber}
        selectChangeDescription={props.selectChangeDescription}
        selectedChangeDescription={props.jira.selectedChangeDescription}
        loginDetails={props.common.loginDetails}
        createRelease={(fields) => {
          props.createItem("release", {
            ...fields,
            projectId: props.jira.projectId,
            reporter: props.common.loginDetails.name,
          });
        }}
        selectPlannedStartDate={props.selectPlannedStartDate}
        selectPlannedDeliveryDate={props.selectPlannedDeliveryDate}
        selectedPlannedStartDate={props.jira.selectedPlannedStartDate}
        selectedPlannedDeliveryDate={props.jira.selectedPlannedDeliveryDate}
        getReleasesForDevice={(device) => {
          props.getReleasesForDevice(props.jira.projectId, device);
        }}
        releasesForDevice={props.jira.releasesForDevice}
        selectRelease={props.selectRelease}
        selectedRelease={props.jira.selectedRelease}
        resetReleasesForDevice={props.resetReleasesForDevice}
        createIOTCycle={(fields) => {
          props.createItem("iotCycle", {
            ...fields,
            projectId: props.jira.projectId,
            reporter: props.common.loginDetails.name,
          });
        }}
        createDefect={(fields, url) => {
          props.createItem(
            "defect",
            {
              ...fields,
              projectId: props.jira.projectId,
              reporter: props.common.loginDetails.name,
            },
            url
          );
        }}
        backendRequestStatus={props.jira.backendRequestStatus}
        modified={props.jira.modified}
        resetAll={props.resetAll}
      />
    </Screen>
  ) : (
    <LoginScreen />
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    common: state.common,
    jira: state.jira,
  };
};
export default connect(mapStateToProps, {
  selectOperation,
  selectAsset,
  initialiseJira,
  getVendors,
  selectVendor,
  selectModel,
  selectMarketName,
  selectDeviceType,
  getDevicesForVendor,
  resetAll,
  getProjectId,
  createItem,
  resetCreationStatus,
  resetDevicesForVendorList,
  getTestingRequestTypes,
  selectTestingRequestType,
  // getTestingPriorities,
  getDeviceTypes,
  // selectTestingPriority,
  getWDATestScopes,
  selectWDATestScope,
  getFunding,
  selectFunding,
  selectBaselineDate,
  selectActualDate,
  selectPlannedStartDate,
  selectPlannedDeliveryDate,
  selectBAUNumber,
  selectChangeDescription,
  getReleasesForDevice,
  resetReleasesForDevice,
  selectRelease,

  logout,
})(JiraLandingScreen);
