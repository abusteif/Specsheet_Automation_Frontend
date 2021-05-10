import { combineReducers } from "redux";
import { commonReducer } from "./common-reducer";
import { automationReducer } from "./automation-reducer";
import { comparisonReducer } from "./comparison-reducer";

export default combineReducers({
  common: commonReducer,
  automation: automationReducer,
  comparison: comparisonReducer,
});
