import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { GET_COURSES_API_URL } from "../../utils/apiUrl";

import { getRequest } from "../../utils/requestMethod";

const getCourseFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async () => {
    return await getRequest(apiUrl);
  });
};

export const fetchGetCourseData = getCourseFetchThunk(
  "fetchGetCourse",
  GET_COURSES_API_URL
);

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (state, action) => {
  console.log(action.payload);
  state.isError = true;
};

const apiSlice = createSlice({
  name: "api",
  initialState: {
    getCourseData: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetCourseData.fulfilled, handleFulfilled("getCourseData"))
      .addCase(fetchGetCourseData.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
