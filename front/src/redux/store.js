import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlice";
import currentStateReducer from "./slices/currentStateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    currentState: currentStateReducer,
  },
});

export default store;
