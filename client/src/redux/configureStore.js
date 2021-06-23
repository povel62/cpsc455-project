import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/rootReducer";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools

  const saveState = (state) => {
    try {
      const serialisedState = JSON.stringify(state);
      window.sessionStorage.setItem("app_state", serialisedState);
    } catch (err) {
      // do nothing
    }
  };

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(reduxImmutableStateInvariant()))
  );

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
}
