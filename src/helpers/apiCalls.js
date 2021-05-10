import backend from "../apis/backend";

let dispatchData;
export const iotCycles = (deviceId, projectId, type) => async (
  dispatch,
  getState
) => {
  let token = getState().common.token;

  try {
    dispatchData = await backend("/iotCycles", {
      params: { deviceId, projectId },
      headers: {
        Authorization: token,
      },
    });
  } catch (e) {
    dispatchData.status = "fail";
    dispatchData.errorMessage = e.message;
  } finally {
    dispatch({
      type,
      payload: dispatchData,
    });
  }
};

export const checkIfAlreadyExecuted = async (
  device,
  iotCycle,
  simType,
  messageType,
  token,
  callBackTrue,
  callBackFalse,
  callBackError
) => {
  try {
    const result = await backend("executionStatus", {
      params: {
        device,
        iotCycle,
        simType,
        messageType,
      },
      headers: {
        Authorization: token,
      },
    });
    if (result.data) {
      callBackTrue();
    } else {
      callBackFalse();
    }
  } catch (e) {
    callBackError();
  }
};
