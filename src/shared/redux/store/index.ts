import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "../../../shared/redux/reducers";

import { loadAllData } from "../actions";

// For using redux dev tools.
// ---------------------
declare const window: any;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// ---------------------

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

/* load all app data on initialization. */
store.dispatch( loadAllData() );