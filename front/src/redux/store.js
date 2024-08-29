import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlice";
import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";
import currentStateReducer from "./slices/currentStateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    user: userReducer,
    user: usersReducer,
    currentState: currentStateReducer,
  },
});

export default store;
