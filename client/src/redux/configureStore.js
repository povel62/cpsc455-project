import { createStore } from "redux";
import reducer from "./reducers";

export default function configureStore(initialState) {
  const saveState = (state) => {
    try {
      const serialisedState = JSON.stringify(state);
      window.sessionStorage.setItem("app_state", serialisedState);
    } catch (err) {
      // nothing
    }
  };

  const store = createStore(reducer, initialState);

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
}
