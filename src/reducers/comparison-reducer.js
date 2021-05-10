import {
  GET_MESSAGE_FIELDS,
  GET_IOT_CYCLE_RESULTS,
  GET_IOT_CYCLE_RESULTS_IN_FLIGHT,
  RESET_IOT_CYCLE_RESULTS,
  GET_DEVICE_LIST,
  GET_SECONDARY_IOT_CYCLES,
  SELECT_SECONDARY_IOT_CYCLE,
  SELECT_SECONDARY_DEVICE,
  GET_MAIN_IOT_CYCLE,
  GET_MAIN_DEVICE,
  GET_MAIN_RATSIM,
  SELECT_SECONDARY_RAT_SIM,
  RESET_SECONDARY_IOT_CYCLE,
  RESET_SECONDARY_IOT_CYCLES,
  RESET_SECONDARY_DEVICE,
  RESET_SECONDARY_RAT_SIM,
} from "../actions/comparison-actions";

const defaultState = {
  devices: [],
  messageFields: [],
  results: {
    mainResult: null,
    secondaryResult: null,
    secondaryInFlight: false,
    mainError: false,
    secondaryError: false,
  },
  mainIotCycle: {},
  mainDevice: {},
  mainRATSIM: null,
  secondaryRATSIM: null,
  secondaryIotCycles: [],
  secondaryIotCycle: {},
  secondaryDevice: {},
};

export const comparisonReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_MESSAGE_FIELDS:
      if (
        state.messageFields.filter(
          (messageType) => messageType.type === action.payload.messageType
        ).length !== 0
      )
        return state;
      return {
        ...state,
        messageFields: [
          ...state.messageFields,
          {
            type: action.payload.messageType,
            fields: action.payload.fields.data,
          },
        ],
      };
    case GET_IOT_CYCLE_RESULTS:
      if (action.payload.type === "main") {
        if (!action.payload.result)
          return {
            ...state,
            results: {
              ...state.results,
              mainResult: { bandCombinations: [], individualIE: [] },
            },
          };
        else {
          return {
            ...state,
            results: {
              ...state.results,
              mainResult: action.payload.result.data,
            },
          };
        }
      }

      // return {
      //   ...state,
      //   results: { ...state.results, mainResult: action.payload.result.data },
      // };
      if (action.payload.type === "secondary")
        if (!action.payload.result)
          return {
            ...state,
            results: {
              ...state.results,
              secondaryResult: { bandCombinations: [], individualIE: [] },
            },
          };
        else {
          return {
            ...state,
            results: {
              ...state.results,
              secondaryResult: action.payload.result.data,
            },
          };
        }

    case GET_IOT_CYCLE_RESULTS_IN_FLIGHT:
      if (action.payload.type === "secondary") {
        if (action.payload.error) {
          return {
            ...state,
            results: {
              ...state.results,
              secondaryError: true,
              secondaryInFlight: action.payload.inFlight,
            },
          };
        } else {
          return {
            ...state,
            results: {
              ...state.results,
              secondaryInFlight: action.payload.inFlight,
            },
          };
        }
      } else {
        if (action.payload.error) {
          return {
            ...state,
            results: { ...state.results, mainError: true },
          };
        }
      }
      return state;

    case RESET_IOT_CYCLE_RESULTS:
      let results = state.results;
      if (action.payload.includes("main"))
        results = { ...results, mainResult: null, mainError: null };
      if (action.payload.includes("secondary"))
        results = { ...results, secondaryResult: null, secondaryError: null };
      return { ...state, results };
    case SELECT_SECONDARY_DEVICE:
      const secondaryDevice = state.devices.filter(
        (device) => device.id === action.payload
      )[0];
      return { ...state, secondaryDevice };
    case SELECT_SECONDARY_IOT_CYCLE:
      const secondaryIotCycle = state.secondaryIotCycles.filter(
        (iotCycle) => iotCycle.id === action.payload
      )[0];
      return { ...state, secondaryIotCycle };

    case GET_DEVICE_LIST:
      return { ...state, devices: action.payload };

    case GET_MAIN_IOT_CYCLE:
      return { ...state, mainIotCycle: action.payload };
    case GET_MAIN_DEVICE:
      return { ...state, mainDevice: action.payload };
    case GET_MAIN_RATSIM:
      return { ...state, mainRATSIM: action.payload };
    case GET_SECONDARY_IOT_CYCLES:
      return { ...state, secondaryIotCycles: action.payload.data };
    case SELECT_SECONDARY_RAT_SIM:
      return { ...state, secondaryRATSIM: action.payload };
    case RESET_SECONDARY_IOT_CYCLE:
      return { ...state, secondaryIotCycle: {} };
    case RESET_SECONDARY_DEVICE:
      return { ...state, secondaryDevice: {} };
    case RESET_SECONDARY_IOT_CYCLES:
      return { ...state, secondaryIotCycles: [] };
    case RESET_SECONDARY_RAT_SIM:
      return { ...state, secondaryRATSIM: null };
      return state;
    default:
      return state;
  }
};
