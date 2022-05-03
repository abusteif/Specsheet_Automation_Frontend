import backend from "../apis/backend";
import { iotCycles } from "../helpers/apiCalls";

export const LOGIN = "common/LOGIN";
export const LOGOUT = "common/LOGOUT";
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

export const logout = () => {
  return { type: LOGOUT };
};

export const login = (dnumber) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatch({
      type: LOGIN,
    });
    dispatchData = await backend.get(`/user/${dnumber}`, {
      headers: {
        Authorization: token,
      },
    });

    dispatch({
      type: LOGIN,
      payload: {
        dispatchData,
      },
    });
  } catch (e) {
    if (e.response)
      dispatch({
        type: LOGIN,
        payload: {
          dispatchData: {
            status: e.response.status,
          },
        },
      });
  }
};

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

export const getProjectId = (projectKey, domain) => async (
  dispatch,
  getState
) => {
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
      payload: { response: dispatchData, domain },
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
