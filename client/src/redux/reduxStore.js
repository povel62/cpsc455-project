import rootReducer from "./reducers/rootReducer";
import { createStore } from "redux";

const store = createStore(rootReducer);

export default store;
