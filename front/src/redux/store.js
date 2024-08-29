import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import apiReducer from "./slices/apiSlice";
import userReducer from "./slices/userSlice";
import usersReducer from "./slices/usersSlice";
import currentStateReducer from "./slices/currentStateSlice";
import userInfoReducer from "./slices/userInfoSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    user: userReducer,
    users: usersReducer,
    currentState: currentStateReducer,
    userInfoState: userInfoReducer,
  },
});

export default store;
