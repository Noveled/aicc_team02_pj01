import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { GET_USER_API_URL } from "../../utils/apiUrl";

import { getRequest } from "../../utils/requestMethod";

const getUserFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async (userId) => {
    const fullPath = `${apiUrl}/${userId}`;
    return await getRequest(fullPath);
  });
};

export const fetchGetUserData = getUserFetchThunk(
  "fetchGetUser",
  GET_USER_API_URL
);

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (state, action) => {
  console.log(action.payload);
  state.isError = true;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetUserData.fulfilled, handleFulfilled("data"))
      .addCase(fetchGetUserData.rejected, handleRejected);
  },
});

export default userSlice.reducer;
