import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_COURSE_API_URL, GET_Facilities_API_URL } from "../../utils/apiUrl";
import { getRequest } from "../../utils/requestMethod";

const getCourseFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async () => {
    return await getRequest(apiUrl);
  });
};

// 코스 정보 api
export const fetchGetCourseData = getCourseFetchThunk(
  "fetchGetCourse",
  GET_COURSE_API_URL
);

const createFetchThunk = (actionType, apiUrl) => {
  // console.log('apiUrl', apiUrl);
  return createAsyncThunk(actionType, async () => {
    return await getRequest(apiUrl);
  });
};

// 물품보관함
export const fetchStorageData = createFetchThunk(
  "fetchGetStorage",
  GET_Facilities_API_URL + "?fac_type=물품보관함"
);

// 공원음수대
export const fetchWaterData = createFetchThunk(
  "fetchGetWater",
  GET_Facilities_API_URL + "?fac_type=공원음수대"
);

// 버스정류장
export const fetchBusStopData = createFetchThunk(
  "fetchGetBusStop",
  GET_Facilities_API_URL + "?fac_type=버스정류장"
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
    getMyCourseData: null,
    storageData: null,
    waterData: null,
    busStopData: null,

    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetCourseData.fulfilled, handleFulfilled("getCourseData"))
      .addCase(fetchGetCourseData.rejected, handleRejected)

      .addCase(fetchStorageData.fulfilled, handleFulfilled("storageData"))
      .addCase(fetchStorageData.rejected, handleRejected)
      .addCase(fetchWaterData.fulfilled, handleFulfilled("waterData"))
      .addCase(fetchWaterData.rejected, handleRejected)
      .addCase(fetchBusStopData.fulfilled, handleFulfilled("busStopData"))
      .addCase(fetchBusStopData.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
