import fileDownload from "js-file-download";

import backend from "../apis/backend";

export const SELECT_RAT_SIM = "automation/SELECT-MESSAGE-TYPE";
export const SET_HEX_DATA = "automation/SET_HEX_DATA";
export const RESET_HEX_DATA = "automation/RESET_HEX_DATA";
export const VALIDATE_HEX_DATA = "automation/VALIDATE_HEX_DATA";
export const VALIDATE_HEX_DATA_IN_FLIGHT =
  "automation/VALIDATE_HEX_DATA_IN_FLIGHT";
export const RESET_VALIDATION_RESULT = "automation/RESET_VALIDATION_RESULT";
export const POPULATE_SPECSHEET = "automation/POPULATE_SPECSHEET";
export const BEGIN_SPECSHEET_GENERATE = "automation/BEGIN_SPECSHEET_GENERATE";
export const FINISH_SPECSHEET_GENERATE = "automation/FINISH_SPECSHEET_GENERATE";
export const RESET_SPECSHEET_GENERATE = "automation/RESET_SPECSHEET_GENERATE";
export const BEGIN_SPECSHEET_UPLOAD = "automation/BEGIN_SPECSHEET_UPLOAD";
export const FINISH_SPECSHEET_UPLOAD = "automation/FINISH_SPECSHEET_UPLOAD";
export const UPLOAD_SPECSHEET = "automation/UPLOAD_SPECSHEET";
export const RESET_SPECSHEET_UPLOAD = "automation/RESET_SPECSHEET_UPLOAD";
export const RESET_RAT_SIM = "automation/RESET_RAT_SIM";

let dispatchData;

export const selectRATSIM = (selectedRATSIM) => {
  return { type: SELECT_RAT_SIM, payload: selectedRATSIM };
};

export const resetRATSIM = () => {
  return { type: RESET_RAT_SIM };
};

export const setHexData = (hexData, messageType) => {
  return {
    type: SET_HEX_DATA,
    payload: {
      hexData,
      messageType,
    },
  };
};

export const resetHexData = (messageType) => {
  return {
    type: RESET_HEX_DATA,
    payload: { messageType },
  };
};

export const resetValidationResult = (messageType) => {
  return {
    type: RESET_VALIDATION_RESULT,
    payload: { messageType },
  };
};

export const resetSpecsheetGenerate = () => {
  return {
    type: RESET_SPECSHEET_GENERATE,
  };
};

export const resetSpecsheetUpload = () => {
  return {
    type: RESET_SPECSHEET_UPLOAD,
  };
};

export const validateHexData = (hexData, messageType, selectedRATSIM) => async (
  dispatch
) => {
  let newMessageType = `${messageType}_${selectedRATSIM}`;
  dispatch({
    type: VALIDATE_HEX_DATA_IN_FLIGHT,
    payload: {
      messageType,
      status: true,
    },
  });
  try {
    dispatchData = await backend.post(
      "/validate",
      { hexData, messageType },
      {
        "Content-Type": "application/json",
      }
    );
    dispatch({
      type: VALIDATE_HEX_DATA_IN_FLIGHT,
      payload: {
        messageType,
        status: false,
      },
    });
    dispatch({
      type: VALIDATE_HEX_DATA,
      payload: {
        dispatchData,
        messageType,
      },
    });
  } catch (e) {
    dispatch({
      type: VALIDATE_HEX_DATA_IN_FLIGHT,
      payload: {
        messageType,
        status: false,
      },
    });
    if (e.response.status !== 400 && e.response.status !== 422) {
      dispatchData.status = "fail";
      dispatchData.errorMessage = e.message;
    } else {
      dispatchData = e.response;
      dispatch({
        type: VALIDATE_HEX_DATA,
        payload: {
          dispatchData,
          messageType,
        },
      });
    }
  }
};

export const populateSpecsheet = (hexData, device, iotCycle) => async (
  dispatch
) => {
  dispatchData = {};
  dispatch({
    type: BEGIN_SPECSHEET_GENERATE,
  });
  try {
    dispatchData = await backend.post(
      "/populateSpecsheet",
      {
        hexData,
        device,
        iotCycle,
      },
      {
        "Content-Type": "application/json",
        responseType: "arraybuffer",
      }
    );
    dispatch({
      type: FINISH_SPECSHEET_GENERATE,
      payload: false,
    });
    dispatch({
      type: POPULATE_SPECSHEET,
      payload: dispatchData,
    });
  } catch (e) {
    dispatch({
      type: FINISH_SPECSHEET_GENERATE,
      payload: true,
    });
    if (e.response.status !== 400 && e.response.status !== 422) {
      dispatchData.status = "fail";
      dispatchData.errorMessage = e.message;
    } else {
      dispatchData = e.response;
      dispatch({
        type: FINISH_SPECSHEET_GENERATE,
        payload: true,
      });
    }
  }
};

export const uploadSpecsheetToJira = (
  hexData,
  messageType,
  simType,
  device,
  iotCycle
) => async (dispatch, getState) => {
  let token = getState().common.token;
  dispatchData = {};

  dispatch({
    type: BEGIN_SPECSHEET_UPLOAD,
  });
  try {
    dispatchData = await backend.post(
      "/uploadToJira",
      { hexData, messageType, simType, device, iotCycle },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    dispatch({
      type: FINISH_SPECSHEET_UPLOAD,
      payload: false,
    });
  } catch (e) {
    dispatch({
      type: FINISH_SPECSHEET_UPLOAD,
      payload: true,
    });
    if (e.response.status !== 400 && e.response.status !== 422) {
      dispatchData.status = "fail";
      dispatchData.errorMessage = e.message;
    }
  }
};
