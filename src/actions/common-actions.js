import backend from "../apis/backend";
import { iotCycles } from "../helpers/apiCalls";

export const GET_TOKEN = "common/GET_TOKEN";
export const GET_ZEPHYR_STATUS = "common/GET_ZEPHYR_STATUS";
export const GET_DEVICES = "common/GET_DEVICES";
export const GET_PROJECT_ID = "common/GET_PROJECT_ID";
export const GET_IOT_CYCLES = "common/GET_IOT_CYCLES";
export const SELECT_DEVICE = "common/SELECT_DEVICE";
export const SELECT_IOT_CYCLE = "common/SELECT_IOT_CYCLE";
export const RESET_SELECTED_DEVICE = "common/RESET_SELECTED_DEVICE";
export const RESET_SELECTED_IOT_CYCLE = "common/RESET_SELECTED_IOT_CYCLE";
export const RESET_ALL_IOT_CYCLES = "common/RESET_ALL_IOT_CYCLES";

let dispatchData;

export const generateCookies = () => async (dispatch) => {
  try {
    dispatchData = await backend(`/generateCookies`);
  } catch (e) {
    dispatchData.status = "fail";
    dispatchData.errorMessage = e.message;
  } finally {
    dispatch({
      type: GET_TOKEN,
      payload: dispatchData,
    });
  }
};

export const getProjectId = (projectKey) => async (dispatch, getState) => {
  let token = getState().common.token;
  try {
    dispatchData = await backend(`/jiraProject/${projectKey}`, {
      // params: { token },
      headers: { Authorization: token },
    });
  } catch (e) {
    dispatchData.status = "fail";
    dispatchData.errorMessage = e.message;
  } finally {
    dispatch({
      type: GET_PROJECT_ID,
      payload: dispatchData,
    });
  }
};

export const getDevices = (projectId) => async (dispatch, getState) => {
  let token = getState().common.token;

  try {
    dispatchData = await backend(`/devices/${projectId}`, {
      // params: { token },
      headers: { Authorization: token },
    });
  } catch (e) {
    dispatchData.status = "fail";
    dispatchData.errorMessage = e.message;
  } finally {
    dispatch({
      type: GET_DEVICES,
      payload: dispatchData,
    });
  }
};

export const getIotCycles = (deviceId, projectId) => {
  return iotCycles(deviceId, projectId, GET_IOT_CYCLES);
};

// export const getIotCycles = (deviceId, projectId) => async (dispatch) => {
//   try {
//     dispatchData = await backend("/iotCycles", {
//       params: { deviceId, projectId },
//     });
//   } catch (e) {
//     dispatchData.status = "fail";
//     dispatchData.errorMessage = e.message;
//   } finally {
//     dispatch({
//       type: GET_IOT_CYCLES,
//       payload: dispatchData,
//     });
//   }
// };

export const selectDevice = (selectedDeviceId) => {
  return { type: SELECT_DEVICE, payload: selectedDeviceId };
};

export const resetSelectedDevice = () => {
  return { type: RESET_SELECTED_DEVICE };
};

export const selectIotCycle = (selectedIotCycleId) => {
  return { type: SELECT_IOT_CYCLE, payload: selectedIotCycleId };
};

export const resetSelectedIotCycle = () => {
  return { type: RESET_SELECTED_IOT_CYCLE };
};

export const resetAllIotCycles = () => {
  return { type: RESET_ALL_IOT_CYCLES };
};
