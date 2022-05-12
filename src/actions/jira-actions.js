import backend from "../apis/backend";

export const SELECT_OPERATION = "jira/SELECT-OPERATION";
export const SELECT_ASSET = "jira/SELECT-ASSET";
export const INITIALISE_JIRA = "jira/INITIALISE_JIRA";
export const GET_VENDORS = "jira/GET_VENDORS";
export const SELECT_VENDOR = "jira/SELECT_VENDOR";
export const SELECT_MODEL = "jira/SELECT_MODEL";
export const RESET_ALL = "jira/RESET_ALL";
export const SELECT_MARKET_NAME = "jira/SELECT_MARKET_NAME";
export const SELECT_DEVICE_TYPE = "jira/SELECT_DEVICE_TYPE";
export const GET_DEVICE_TYPES = "jira/GET_DEVICE_TYPES";
export const CREATE_ITEM = "jira/CREATE_ITEM";
export const RESET_CREATION_STATUS = "jira/RESET_CREATION_STATUS";
export const GET_DEVICES_FOR_VENDOR = "jira/GET_DEVICES_FOR_VENDOR";
export const RESET_DEVICES_FOR_VENDOR_LIST =
  "jira/RESET_DEVICES_FOR_VENDOR_LIST";
export const GET_TESTING_REQUEST_TYPES = "jira/GET_TESTING_REQUEST_TYPES";
export const SELECT_TESTING_REQUEST_TYPE = "jira/SELECT_TESTING_REQUEST_TYPE";
export const GET_TESTING_PRIORITIES = "jira/GET_TESTING_PRIORITIES";
// export const SELECT_TESTING_PRIORITY = "jira/SELECT_TESTING_PRIORITY";
export const GET_WDA_TEST_SCOPE = "jira/GET_WDA_TEST_SCOPE";
export const SELECT_WDA_TEST_SCOPE = "jira/SELECT_WDA_TEST_SCOPE";
export const GET_FUNDING = "jira/GET_FUNDING";
export const SELECT_FUNDING = "jira/SELECT_FUNDING";
export const SELECT_BASELINE_DATE = "jira/SELECT_BASELINE_DATE";
export const SELECT_ACTUAL_DATE = "jira/SELECT_ACTUAL_DATE";
export const SELECT_BAU_NUMBER = "jira/SELECT_BAU_NUMBER";
export const SELECT_CHANGE_DESCRIPTION = "jira/SELECT_CHANGE_DESCRIPTION";
export const GET_RELEASES_FOR_DEVICE = "jira/GET_RELEASES_FOR_DEVICE";
export const SELECT_PLANNED_DELIVERY_DATE = "jira/SELECT_PLANNED_DELIVERY_DATE";
export const SELECT_PLANNED_START_DATE = "jira/SELECT_PLANNED_START_DATE";
export const SELECT_RELEASE = "jira/SELECT_RELEASE";
export const RESET_RELEASES_FOR_DEVICE = "jira/RESET_RELEASES_FOR_DEVICE";

let dispatchData;

export const selectOperation = (op) => {
  return { type: SELECT_OPERATION, payload: op };
};

export const selectAsset = (asset) => {
  return { type: SELECT_ASSET, payload: asset };
};

export const selectVendor = (vendor) => {
  return { type: SELECT_VENDOR, payload: vendor };
};

export const selectModel = (model) => {
  return { type: SELECT_MODEL, payload: model };
};

export const selectMarketName = (marketName) => {
  return { type: SELECT_MARKET_NAME, payload: marketName };
};

export const selectDeviceType = (deviceType) => {
  return { type: SELECT_DEVICE_TYPE, payload: deviceType };
};

export const selectTestingRequestType = (type) => {
  return { type: SELECT_TESTING_REQUEST_TYPE, payload: type };
};

// export const selectTestingPriority = (priority) => {
//   return { type: SELECT_TESTING_PRIORITY, payload: priority };
// };

export const selectWDATestScope = (scope) => {
  return { type: SELECT_WDA_TEST_SCOPE, payload: scope };
};

export const selectFunding = (funding) => {
  return { type: SELECT_FUNDING, payload: funding };
};

export const selectBaselineDate = (date) => {
  return { type: SELECT_BASELINE_DATE, payload: date };
};

export const selectActualDate = (date) => {
  return { type: SELECT_ACTUAL_DATE, payload: date };
};

export const selectChangeDescription = (text) => {
  return { type: SELECT_CHANGE_DESCRIPTION, payload: text };
};

export const selectPlannedStartDate = (date) => {
  return { type: SELECT_PLANNED_START_DATE, payload: date };
};

export const selectPlannedDeliveryDate = (date) => {
  return { type: SELECT_PLANNED_DELIVERY_DATE, payload: date };
};

export const selectBAUNumber = (num) => {
  return { type: SELECT_BAU_NUMBER, payload: num };
};

export const selectRelease = (release) => {
  return { type: SELECT_RELEASE, payload: release };
};

export const resetReleasesForDevice = () => {
  return { type: RESET_RELEASES_FOR_DEVICE };
};

export const resetAll = () => {
  return { type: RESET_ALL };
};

export const resetCreationStatus = () => {
  return { type: RESET_CREATION_STATUS };
};

export const resetDevicesForVendorList = () => {
  return { type: RESET_DEVICES_FOR_VENDOR_LIST };
};

export const initialiseJira = (forceUpdate, projectId) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatchData = await backend.put(
      "/jiraInitialise",
      { forceUpdate, projectId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    dispatch({
      type: INITIALISE_JIRA,
      payload: {
        dispatchData,
      },
    });
  } catch (e) {}
};

export const getVendors = (projectId) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatchData = await backend.get(`/vendors/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });
    dispatch({
      type: GET_VENDORS,
      payload: dispatchData,
    });
  } catch (e) {}
};

export const getDeviceTypes = (projectId) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatchData = await backend.get(`/deviceTypes/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });
    dispatch({
      type: GET_DEVICE_TYPES,
      payload: dispatchData,
    });
  } catch (e) {}
};

export const getTestingRequestTypes = (projectId) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatchData = await backend.get(`/testingRequestTypes/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });
    dispatch({
      type: GET_TESTING_REQUEST_TYPES,
      payload: dispatchData,
    });
  } catch (e) {}
};

export const getDevicesForVendor = (projectId, vendor) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;
  dispatch({
    type: GET_DEVICES_FOR_VENDOR,
  });
  dispatchData = {};
  try {
    dispatchData = await backend.get(
      `/devicesForVendor/${projectId}/${vendor}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    dispatch({
      type: GET_DEVICES_FOR_VENDOR,
      payload: dispatchData,
    });
  } catch (e) {}
};

export const getReleasesForDevice = (projectId, device) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;
  dispatch({
    type: GET_RELEASES_FOR_DEVICE,
  });
  dispatchData = {};
  try {
    dispatchData = await backend.get(
      `/releasesForDevice/${projectId}/${device}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    dispatch({
      type: GET_RELEASES_FOR_DEVICE,
      payload: dispatchData,
    });
  } catch (e) {}
};

// export const getTestingPriorities = (projectId, vendor) => async (
//   dispatch,
//   getState
// ) => {
//   let token = getState().common.token;
//   dispatchData = {};
//   try {
//     dispatchData = await backend.get(`/testingPriorities/${projectId}`, {
//       headers: {
//         Authorization: token,
//       },
//     });
//     dispatch({
//       type: GET_TESTING_PRIORITIES,
//       payload: dispatchData,
//     });
//   } catch (e) {}
// };

export const getWDATestScopes = (projectId, vendor) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatchData = await backend.get(`/wdaTestScopes/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });
    dispatch({
      type: GET_WDA_TEST_SCOPE,
      payload: dispatchData,
    });
  } catch (e) {}
};

export const getFunding = (projectId, vendor) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatchData = await backend.get(`/funding/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });
    dispatch({
      type: GET_FUNDING,
      payload: dispatchData,
    });
  } catch (e) {}
};

export const createItem = (itemType, itemDetails, url) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;
  dispatchData = {};
  let body = { issueDetails: itemDetails };
  if (url) body = { ...body, url };
  try {
    dispatch({
      type: CREATE_ITEM,
    });
    dispatchData = await backend.post(itemType, body, {
      headers: {
        Authorization: token,
      },
    });

    dispatch({
      type: CREATE_ITEM,
      payload: {
        dispatchData,
      },
    });
  } catch (e) {
    if (e.response)
      dispatch({
        type: CREATE_ITEM,
        payload: {
          dispatchData: {
            status: e.response.status,
          },
        },
      });
  }
};
