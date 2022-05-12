import {
  SELECT_OPERATION,
  SELECT_ASSET,
  INITIALISE_JIRA,
  GET_VENDORS,
  SELECT_VENDOR,
  SELECT_MODEL,
  SELECT_MARKET_NAME,
  SELECT_DEVICE_TYPE,
  GET_DEVICES_FOR_VENDOR,
  GET_DEVICE_TYPES,
  CREATE_ITEM,
  RESET_CREATION_STATUS,
  RESET_ALL,
  RESET_DEVICES_FOR_VENDOR_LIST,
  SELECT_TESTING_REQUEST_TYPE,
  GET_TESTING_REQUEST_TYPES,
  // GET_TESTING_PRIORITIES,
  // SELECT_TESTING_PRIORITY,
  GET_WDA_TEST_SCOPE,
  SELECT_WDA_TEST_SCOPE,
  GET_FUNDING,
  SELECT_FUNDING,
  SELECT_ACTUAL_DATE,
  SELECT_BASELINE_DATE,
  SELECT_BAU_NUMBER,
  SELECT_CHANGE_DESCRIPTION,
  GET_RELEASES_FOR_DEVICE,
  SELECT_PLANNED_DELIVERY_DATE,
  SELECT_PLANNED_START_DATE,
  SELECT_RELEASE,
  RESET_RELEASES_FOR_DEVICE,
} from "../actions/jira-actions";

import { GET_PROJECT_ID } from "../actions/common-actions";
import { SUCCESS, ERROR, UNSTARTED, STARTED } from "../configs/configurations";

// creationStatus values: unstarted, started, successful, failed

const initialState = {
  selectedVendor: "",
  selectedModel: "",
  selectedMarketName: "",
  selectedDeviceType: "",
  creationStatus: UNSTARTED,
  newCreatedKey: "",
  devicesForVendor: [],
  releasesForDevice: [],
  selectedTestingRequestType: "",
  // selectedTestingPriority: "",
  selectedWDATestScope: "",
  selectedFunding: "",
  selectedActualDate: null,
  selectedBaselineDate: null,
  selectedBAUNumber: "",
  selectedChangeDescription: "",
  backendRequestStatus: UNSTARTED,
  selectedRelease: "",
  selectedPlannedDeliveryDate: null,
  selectedPlannedStartDate: null,
};
const defaultState = {
  modified: false,
  projectId: "",
  selectedOperation: "",
  selectedAsset: "",
  jiraInitiated: false,
  vendors: [],
  deviceTypes: [],
  testingRequestTypes: [],
  // testingPriorities: [],
  wdaTestScopes: [],
  funding: [],
  ...initialState,
};
export const jiraReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SELECT_OPERATION:
      return {
        ...state,
        selectedOperation: action.payload,
      };
    case GET_PROJECT_ID:
      if (action.payload.domain === "jira")
        return { ...state, projectId: action.payload.response.data.id };
      else {
        return { ...state };
      }
    case SELECT_ASSET:
      return {
        ...state,
        selectedAsset: action.payload,
      };
    case INITIALISE_JIRA:
      return {
        ...state,
        jiraInitiated: true,
      };
    case GET_VENDORS:
      return {
        ...state,
        vendors: action.payload.data,
      };
    case SELECT_VENDOR:
      return {
        ...state,
        selectedVendor: action.payload,
        modified: true,
      };

    case SELECT_MODEL:
      return {
        ...state,
        selectedModel: action.payload,
      };
    case SELECT_MARKET_NAME:
      return {
        ...state,
        selectedMarketName: action.payload,
      };
    case SELECT_DEVICE_TYPE:
      return {
        ...state,
        selectedDeviceType: action.payload,
      };
    // case SELECT_TESTING_PRIORITY:
    //   return {
    //     ...state,
    //     selectedTestingPriority: action.payload,
    //   };

    case SELECT_TESTING_REQUEST_TYPE:
      return {
        ...state,
        selectedTestingRequestType: action.payload,
      };
    case SELECT_WDA_TEST_SCOPE:
      return {
        ...state,
        selectedWDATestScope: action.payload,
      };
    case SELECT_FUNDING:
      return {
        ...state,
        selectedFunding: action.payload,
      };

    case SELECT_BASELINE_DATE:
      return {
        ...state,
        selectedBaselineDate: action.payload,
      };
    case SELECT_ACTUAL_DATE:
      return {
        ...state,
        selectedActualDate: action.payload,
      };

    case SELECT_PLANNED_START_DATE:
      return {
        ...state,
        selectedPlannedStartDate: action.payload,
      };

    case SELECT_PLANNED_DELIVERY_DATE:
      return {
        ...state,
        selectedPlannedDeliveryDate: action.payload,
      };
    case SELECT_RELEASE:
      return {
        ...state,
        selectedRelease: action.payload,
      };

    case SELECT_CHANGE_DESCRIPTION:
      return {
        ...state,
        selectedChangeDescription: action.payload,
      };

    case SELECT_BAU_NUMBER:
      return {
        ...state,
        selectedBAUNumber: action.payload,
      };

    case GET_DEVICE_TYPES:
      return {
        ...state,
        deviceTypes: action.payload.data,
      };
    case GET_TESTING_REQUEST_TYPES:
      return {
        ...state,
        testingRequestTypes: action.payload.data,
      };
    // case GET_TESTING_PRIORITIES:
    //   return {
    //     ...state,
    //     testingPriorities: action.payload.data,
    //   };
    case GET_WDA_TEST_SCOPE:
      return {
        ...state,
        wdaTestScopes: action.payload.data,
      };
    case GET_FUNDING:
      return {
        ...state,
        funding: action.payload.data.filter((item) => {
          return item.name.includes("WDA");
        }),
      };
    case GET_DEVICES_FOR_VENDOR:
      if (state.backendRequestStatus === UNSTARTED)
        return {
          ...state,
          backendRequestStatus: STARTED,
        };
      let newDeviceList = [];
      let model = null;
      for (var device in action.payload.data) {
        let model = action.payload.data[device].modelMarketName
          .split("(")[0]
          .trim();
        let marketName = action.payload.data[device].modelMarketName
          .split("(")[1]
          ?.split(")")[0]
          .trim();
        // var sp = action.payload.data[device].summary.split(" ");
        // for (var i = 4; i > 0; i--) {
        //   if (state.vendors.find((x) => x.name === sp.slice(0, i).join(" "))) {
        //     model = sp.slice(i).join(" ");
        //     break;
        //   }
        //   if (!model) model = action.payload.data[device].summary;
        // }
        let { key, type, summary } = action.payload.data[device];
        newDeviceList = [
          ...newDeviceList,
          {
            key,
            type,
            summary,
            model,
            marketName,
          },
        ];
      }
      console.log(newDeviceList);
      return {
        ...state,
        devicesForVendor: newDeviceList,
        backendRequestStatus: UNSTARTED,
      };

    case GET_RELEASES_FOR_DEVICE:
      if (state.backendRequestStatus === UNSTARTED)
        return {
          ...state,
          backendRequestStatus: STARTED,
        };

      return {
        ...state,
        releasesForDevice: action.payload.data,
        backendRequestStatus: UNSTARTED,
      };

    case CREATE_ITEM:
      if (state.creationStatus === UNSTARTED)
        return { ...state, creationStatus: STARTED };
      else {
        if (action.payload.dispatchData.status === 201)
          return {
            ...state,
            creationStatus: SUCCESS,
            newCreatedKey: action.payload.dispatchData.data.key,
          };
        else {
          return {
            ...state,
            creationStatus: ERROR,
          };
        }
      }

    case RESET_CREATION_STATUS: {
      return { ...state, creationStatus: UNSTARTED, newCreatedKey: "" };
    }
    case RESET_DEVICES_FOR_VENDOR_LIST: {
      return { ...state, devicesForVendor: [] };
    }
    case RESET_RELEASES_FOR_DEVICE: {
      return { ...state, releasesForDevice: [] };
    }

    case RESET_ALL:
      return {
        ...state,
        ...initialState,
        modified: false,
      };
    default:
      return state;
  }
};
