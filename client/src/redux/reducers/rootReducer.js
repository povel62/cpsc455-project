import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import kaggleReducer from "./kaggleReducer";

const rootReducer = combineReducers({
  loginReducer,
  kaggleReducer,
});

// let initState = {
//   login: "",
//   kaggle: { kapi: {}, competitions: [], datasets: [] },
// };

// const rootReducer = (state = initState, action) => {
//   return {
//     loginReducer: loginReducer(state.login, action),
//     kaggleReducer: kaggleReducer(state.kaggle, action),
//   };
// };

export default rootReducer;
