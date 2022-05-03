import {
  LOGIN,
  LOGOUT,
  GET_TOKEN,
  GET_ZEPHYR_STATUS,
  GET_DEVICES,
  GET_PROJECT_ID,
  GET_IOT_CYCLES,
  SELECT_DEVICE,
  SELECT_IOT_CYCLE,
  RESET_SELECTED_DEVICE,
  RESET_SELECTED_IOT_CYCLE,
  RESET_ALL_IOT_CYCLES,
} from "../actions/common-actions";

import {
  LOGGEDIN,
  LOGGEDOUT,
  LOGGINGIN,
  ERROR,
} from "../configs/configurations";

const defaultState = {
  loginDetails: {},
  loginStatus: LOGGEDOUT,
  token: "",
  status: true,
  errorMessage: "",
  devices: [],
  selectedDevice: {},
  iotCycles: [],
  selectedIotCycle: {},
};

export const commonReducer = (state = defaultState, action) => {
  if (action.payload && action.payload.status === "fail") {
    return {
      ...state,
      status: false,
      errorMessage: action.payload.errorMessage,
    };
  } else {
    state = { ...state, status: true, errorMessage: "" };
  }

  switch (action.type) {
    case LOGIN:
      if (state.loginStatus === LOGGEDOUT || state.loginStatus === ERROR)
        return { ...state, loginStatus: LOGGINGIN };
      else {
        if (action.payload.dispatchData.status === 200)
          return {
            ...state,
            loginStatus: LOGGEDIN,
            loginDetails: action.payload.dispatchData.data,
          };
        else {
          return {
            ...state,
            loginStatus: ERROR,
            loginDetails: null,
          };
        }
      }
    case LOGOUT:
      return { ...state, loginDetails: {}, loginStatus: LOGGEDOUT };
    case GET_TOKEN:
      return { ...state, token: action.payload.data.token };
    case GET_DEVICES:
      return { ...state, devices: action.payload.data.values };
    case SELECT_DEVICE:
      const selectedDevice = state.devices.filter(
        (device) => device.id === action.payload
      )[0];
      return { ...state, selectedDevice };
    case RESET_SELECTED_DEVICE:
      return { ...state, selectedDevice: {} };
    case GET_IOT_CYCLES:
      return { ...state, iotCycles: action.payload.data };
    case SELECT_IOT_CYCLE:
      const selectedIotCycle = state.iotCycles.filter(
        (iotCycle) => iotCycle.id === action.payload
      )[0];
      return { ...state, selectedIotCycle };
    case RESET_SELECTED_IOT_CYCLE:
      return { ...state, selectedIotCycle: {} };
    case RESET_ALL_IOT_CYCLES:
      return { ...state, iotCycles: [] };
    default:
      return state;
  }
};
