import {
  SELECT_RAT_SIM,
  SET_HEX_DATA,
  RESET_HEX_DATA,
  VALIDATE_HEX_DATA,
  VALIDATE_HEX_DATA_IN_FLIGHT,
  RESET_VALIDATION_RESULT,
  POPULATE_SPECSHEET,
  BEGIN_SPECSHEET_GENERATE,
  FINISH_SPECSHEET_GENERATE,
  RESET_SPECSHEET_GENERATE,
  BEGIN_SPECSHEET_UPLOAD,
  FINISH_SPECSHEET_UPLOAD,
  RESET_SPECSHEET_UPLOAD,
  RESET_RAT_SIM,
} from "../actions/automation-actions";

var _ = require("lodash");

const defaultHex = {
  data: "",
  validateInFlight: false,
  validated: false,
  validationError: false,
};

const defaultState = {
  selectedRATSIM: null,
  hexData: {
    UECapabilityInformation_4G: { ...defaultHex },
    UECapabilityInformation_5G: { ...defaultHex },
    attachRequest: { ...defaultHex },
    ESMInformationResponse: { ...defaultHex },
  },

  specsheet: {
    isGenerateStarted: false,
    isGenerateReady: false,
    docData: null,
    generateError: false,
    isUploadStarted: false,
    isUploadComplete: false,
    uploadError: false,
  },
};

export const automationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SELECT_RAT_SIM:
      return { ...state, selectedRATSIM: action.payload };
    case RESET_RAT_SIM:
      return { ...state, selectedRATSIM: "" };
    case SET_HEX_DATA:
      let newHexData = { ...state.hexData };
      newHexData[action.payload.messageType].data = action.payload.hexData;
      return { ...state, hexData: newHexData };
    case RESET_HEX_DATA:
      if (!action.payload.messageType) {
        return {
          ...state,
          hexData: {
            UECapabilityInformation_4G: { ...defaultHex },
            UECapabilityInformation_5G: { ...defaultHex },
            attachRequest: { ...defaultHex },
            ESMInformationResponse: { ...defaultHex },
          },
        };
      } else {
        let newHexData1 = { ...state.hexData };
        newHexData1[action.payload.messageType] = {
          data: "",
          validateInFlight: false,
          validated: false,
          validationError: false,
        };
        return { ...state, hexData: newHexData1 };
      }

    case RESET_VALIDATION_RESULT:
      let newHexData2 = { ...state.hexData };
      if (!action.payload.messageType) {
        _.forEach(newHexData2, (value, key) => {
          newHexData2[key].validateInFlight = false;
          newHexData2[key].validated = false;
          newHexData2[key].validationError = false;
        });
      } else {
        newHexData2[action.payload.messageType].validateInFlight = false;
        newHexData2[action.payload.messageType].validated = false;
        newHexData2[action.payload.messageType].validationError = false;
      }
      return {
        ...state,
        hexData: newHexData2,
      };

    case VALIDATE_HEX_DATA:
      let newHexData4 = { ...state.hexData };

      if (action.payload.dispatchData.status === 200)
        newHexData4[action.payload.messageType].validated = true;
      else {
        newHexData4[action.payload.messageType].validated = false;
        newHexData4[action.payload.messageType].validationError = true;
      }
      return { ...state, hexData: newHexData4 };

    case VALIDATE_HEX_DATA_IN_FLIGHT:
      let newHexData3 = { ...state.hexData };
      newHexData3[action.payload.messageType].validateInFlight =
        action.payload.status;
      return { ...state, hexData: newHexData3 };

    case POPULATE_SPECSHEET:
      return {
        ...state,
        specsheet: { ...state.specsheet, docData: action.payload.data },
      };
    case BEGIN_SPECSHEET_GENERATE:
      return {
        ...state,
        specsheet: { ...state.specsheet, isGenerateStarted: true },
      };
    case FINISH_SPECSHEET_GENERATE:
      return {
        ...state,
        specsheet: {
          ...state.specsheet,
          isGenerateStarted: false,
          generateError: action.payload,
          isGenerateReady: !action.payload,
        },
      };
    case RESET_SPECSHEET_GENERATE:
      return {
        ...state,
        specsheet: {
          ...state.specsheet,
          isGenerateStarted: false,
          isGenerateReady: false,
          docData: null,
          generateError: false,
        },
      };
    case RESET_SPECSHEET_UPLOAD:
      return {
        ...state,
        specsheet: {
          ...state.specsheet,
          isUploadStarted: false,
          isUploadComplete: false,
          uploadError: false,
        },
      };
    case BEGIN_SPECSHEET_UPLOAD:
      return {
        ...state,
        specsheet: { ...state.specsheet, isUploadStarted: true },
      };

    case FINISH_SPECSHEET_UPLOAD:
      return {
        ...state,
        specsheet: {
          ...state.specsheet,
          isUploadStarted: false,
          isUploadComplete: true,
          uploadError: action.payload,
        },
      };
    default:
      return state;
  }
};
