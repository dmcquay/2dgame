import * as gameController from "./game";

export function initControls() {
  window.addEventListener("keypress", evt => {
    // gameController.foo(2);
  });
}
/**
store
  - onchange
initializeReducers(store, reducers)
reducer(state, action) => state
 */