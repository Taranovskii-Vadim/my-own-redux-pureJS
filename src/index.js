// createStoreFile.js
const createMyStore = (rootReducer, initialState) => {
  let state = initialState;
  const subscribers = [];
  return {
    getState() {
      return state;
    },
    dispatch(action) {
      state = rootReducer(state, action);
      subscribers.forEach((item) => item());
    },
    subscribe(observer) {
      subscribers.push(observer);
    },
  };
};

// Types
const ADD = "ADD";
const SUB = "SUB";
const ASYNC = "ASYNC";
const TOGGLE_BTN = "TOGGLE_BTN";
// Action creators
const addNum = (num) => ({ type: ADD, payload: num });
const subNum = (num) => ({ type: SUB, payload: num });
// Reducer
const handlers = {
  [ADD]: (state, { payload }) => ({
    ...state,
    counter: state.counter + payload,
  }),
  [SUB]: (state, { payload }) => ({
    ...state,
    counter: state.counter - payload,
  }),
  [ASYNC]: (state) => ({ ...state, counter: state.counter + 1 }),
  [TOGGLE_BTN]: (state) => ({ ...state, disabled: !state.disabled }),
  DEFAULT: (state) => state,
};

const rootReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};

// Index.js
const counter = document.getElementById("counter");
const add = document.getElementById("add");
const sub = document.getElementById("sub");
const async = document.getElementById("async");

const store = createMyStore(rootReducer, { counter: 0, disabled: false });

store.subscribe(() => {
  const state = store.getState();
  async.disabled = state.disabled;
  counter.textContent = state.counter;
});

add.addEventListener("click", () => {
  store.dispatch(addNum(5));
});

sub.addEventListener("click", () => {
  store.dispatch(subNum(5));
});
async.addEventListener("click", () => {
  store.dispatch({ type: TOGGLE_BTN });
  setTimeout(() => {
    store.dispatch({ type: ASYNC });
    store.dispatch({ type: TOGGLE_BTN });
  }, 2000);
});
store.dispatch({ type: "__INIT_APP__" });
