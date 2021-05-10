import backend from "../apis/backend";
import { iotCycles } from "../helpers/apiCalls";

export const GET_MESSAGE_FIELDS = "comparison/GET_MESSAGE_FIELDS";
export const GET_IOT_CYCLE_RESULTS = "comparison/GET_IOT_CYCLE_RESULTS";
export const GET_IOT_CYCLE_RESULTS_IN_FLIGHT =
  "comparison/GET_IOT_CYCLE_RESULTS_IN_FLIGHT";
export const RESET_IOT_CYCLE_RESULTS = "comparison/RESET_IOT_CYCLE_RESULTS";
export const SELECT_SECONDARY_IOT_CYCLE =
  "comparison/SELECT_SECONDARY_IOT_CYCLE";
export const SELECT_SECONDARY_DEVICE = "comparison/SELECT_SECONDARY_DEVICE";
export const GET_DEVICE_LIST = "comparison/GET_DEVICE_LIST";
export const GET_SECONDARY_IOT_CYCLES = "comparison/GET_SECONDARY_IOT_CYCLES";
export const GET_MAIN_IOT_CYCLE = "comparison/GET_MAIN_IOT_CYCLE";
export const GET_MAIN_DEVICE = "comparison/GET_MAIN_DEVICE";
export const GET_MAIN_RATSIM = "comparison/GET_MAIN_RATSIM";
export const SELECT_SECONDARY_RAT_SIM = "comparison/SELECT_SECONDARY_RAT_SIM";
export const RESET_SECONDARY_IOT_CYCLE = "comparison/RESET_SECONDARY_IOT_CYCLE";
export const RESET_SECONDARY_DEVICE = "comparison/RESET_SECONDARY_DEVICE";
export const RESET_SECONDARY_IOT_CYCLES =
  "comparison/RESET_SECONDARY_IOT_CYCLES";
export const RESET_SECONDARY_RAT_SIM = "comparison/RESET_SECONDARY_RAT_SIM";

let dispatchData;

export const getMessageFields = (messageType) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = null;
  try {
    dispatchData = await backend(`/messageFields/${messageType}`, {
      params: { token },
    });
  } catch (e) {
    dispatchData.status = "fail";
    dispatchData.errorMessage = e.message;
  } finally {
    dispatch({
      type: GET_MESSAGE_FIELDS,
      payload: { messageType, fields: dispatchData },
    });
  }
};

export const getIotCycleResults = (
  device,
  iotCycle,
  messageType,
  simType,
  primaryOrSecondary
) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = {};
  try {
    dispatch({
      type: GET_IOT_CYCLE_RESULTS_IN_FLIGHT,
      payload: { type: primaryOrSecondary, inFlight: true },
    });
    dispatchData = await backend("/specsheetIEFromJira", {
      params: { messageType, simType, iotCycle, device },
      headers: { Authorization: token },
    });
    dispatch({
      type: GET_IOT_CYCLE_RESULTS_IN_FLIGHT,
      payload: { type: primaryOrSecondary, inFlight: false },
    });
    dispatch({
      type: GET_IOT_CYCLE_RESULTS,
      payload: { type: primaryOrSecondary, result: dispatchData },
    });
  } catch (e) {
    if (e.response.status !== 404) {
      dispatchData.status = "fail";
      dispatchData.errorMessage = e.message;
      dispatch({
        type: GET_IOT_CYCLE_RESULTS_IN_FLIGHT,
        payload: { type: primaryOrSecondary, inFlight: false, error: true },
      });
    } else {
      dispatch({
        type: GET_IOT_CYCLE_RESULTS_IN_FLIGHT,
        payload: { type: primaryOrSecondary, inFlight: false },
      });
      dispatch({
        type: GET_IOT_CYCLE_RESULTS,
        payload: { type: primaryOrSecondary, result: null },
      });
    }
  }
};

export const resetIotCycleResults = (iotCycleToBeReset) => {
  return {
    type: RESET_IOT_CYCLE_RESULTS,
    payload: iotCycleToBeReset,
  };
};

export const getDeviceList = () => (dispatch, getState) => {
  dispatch({
    type: GET_DEVICE_LIST,
    payload: getState().common.devices,
  });
};

export const getMainIotCycle = () => (dispatch, getState) => {
  dispatch({
    type: GET_MAIN_IOT_CYCLE,
    payload: getState().common.selectedIotCycle,
  });
};

export const getMainDevice = () => (dispatch, getState) => {
  dispatch({
    type: GET_MAIN_DEVICE,
    payload: getState().common.selectedDevice,
  });
};

export const getMainRATSIM = () => (dispatch, getState) => {
  dispatch({
    type: GET_MAIN_RATSIM,
    payload: getState().automation.selectedRATSIM,
  });
};

export const getIotCycles = (deviceId, projectId) => {
  return iotCycles(deviceId, projectId, GET_SECONDARY_IOT_CYCLES);
};

export const selectSecondaryIotCycle = (selectedIotCycleId) => {
  return { type: SELECT_SECONDARY_IOT_CYCLE, payload: selectedIotCycleId };
};

export const selectSecondaryDevice = (selectedDeviceId) => {
  return { type: SELECT_SECONDARY_DEVICE, payload: selectedDeviceId };
};

export const selectSecondaryRATSIM = (selectedRATSIM) => {
  return { type: SELECT_SECONDARY_RAT_SIM, payload: selectedRATSIM };
};

export const resetSecondaryIotCycles = () => {
  return { type: RESET_SECONDARY_IOT_CYCLES };
};

export const resetSecondaryIotCycle = () => {
  return { type: RESET_SECONDARY_IOT_CYCLE };
};

export const resetSecondaryDevice = () => {
  return { type: RESET_SECONDARY_DEVICE };
};
export const resetSecondaryRATSIM = () => {
  return { type: RESET_SECONDARY_RAT_SIM };
};
