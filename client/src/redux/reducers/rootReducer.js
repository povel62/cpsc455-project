import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import kaggleReducer from "./kaggleReducer";

const rootReducer = combineReducers({
  loginReducer,
  kaggleReducer,
});

export default rootReducer;
