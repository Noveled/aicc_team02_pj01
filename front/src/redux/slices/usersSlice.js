import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { GET_USERS_API_URL } from "../../utils/apiUrl";

import { getRequest } from "../../utils/requestMethod";

const getUsersFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async () => {
    return await getRequest(apiUrl);
  });
};

export const fetchGetUsersData = getUsersFetchThunk(
  "fetchGetUser",
  GET_USERS_API_URL
);

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (state, action) => {
  console.log(action.payload);
  state.isError = true;
};

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetUsersData.fulfilled, handleFulfilled("data"))
      .addCase(fetchGetUsersData.rejected, handleRejected);
  },
});

export default usersSlice.reducer;
