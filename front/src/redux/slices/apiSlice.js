import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  DELETE_COURSE_API_URL,
  GET_COURSE_API_URL,
  GET_Facilities_API_URL,
  GET_USER_JOIN_COURSE_API_URL,
  GET_USERS_JOIN_COURSE_API_URL,
  UPDATE_COURSE_API_URL,
} from "../../utils/apiUrl";
import { deleteRequest, getRequest } from "../../utils/requestMethod";

const getCourseFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async () => {
    return await getRequest(apiUrl);
  });
};

const getUserJoinCourseFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async (userId) => {
    const fullPath = `${apiUrl}/${userId}`;
    return await getRequest(fullPath);
  });
};

const deleteItemFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async (id) => {
    const options = {
      method: "DELETE",
    };
    const fullPath = `${apiUrl}/${id}`;
    return await deleteRequest(fullPath, options);
  });
};

const updateItemFetchThunk = (actionType, apiUrl) => {
  return createAsyncThunk(actionType, async (updateData, id) => {
    const fullPath = `${apiUrl}/${id}`;
    const options = {
      body: JSON.stringify(updateData), // 표준 JSON 문자열로 변환
    };
    return await getRequest(fullPath, options);
  });
};

// const updateItemFetchThunk = (actionType, apiUrl) => {
//   return createAsyncThunk(actionType, async (updateData) => {
//     const options = {
//       body: JSON.stringify(updateData), // 표준 JSON 문자열로 변환
//     };
//     return await putRequest(apiUrl, options);
//   });
// };

// 코스 정보 api
export const fetchGetCourseData = getCourseFetchThunk(
  "fetchGetCourse",
  GET_COURSE_API_URL
);

export const fetchGetUserJoinCourseData = getUserJoinCourseFetchThunk(
  "fetchGetUserJoinCourse",
  GET_USER_JOIN_COURSE_API_URL
);

export const fetchGetUsersJoinCourseData = getCourseFetchThunk(
  "fetchGetUsersJoinCourse",
  GET_USERS_JOIN_COURSE_API_URL
);

export const fetchDeleteCourse = deleteItemFetchThunk(
  "fetchDeleteCourse",
  DELETE_COURSE_API_URL
);

export const fetchUpdateCourse = updateItemFetchThunk(
  "fetchUpdateCourse",
  UPDATE_COURSE_API_URL
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
    myCourse: null,
    usersCourse: null,
    deleteCourse: null,
    updateCourse: null,
    storageData: null,
    waterData: null,
    busStopData: null,

    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetCourseData.fulfilled, handleFulfilled("getCourseData"))
      .addCase(fetchGetCourseData.rejected, handleRejected)
      .addCase(
        fetchGetUserJoinCourseData.fulfilled,
        handleFulfilled("myCourse")
      )
      .addCase(fetchGetUserJoinCourseData.rejected, handleRejected)
      .addCase(
        fetchGetUsersJoinCourseData.fulfilled,
        handleFulfilled("usersCourse")
      )
      .addCase(fetchGetUsersJoinCourseData.rejected, handleRejected)

      .addCase(fetchDeleteCourse.fulfilled, handleFulfilled("deleteCourse"))
      .addCase(fetchDeleteCourse.rejected, handleRejected)
      .addCase(fetchUpdateCourse.fulfilled, handleFulfilled("updateCourse"))
      .addCase(fetchUpdateCourse.rejected, handleRejected)

      .addCase(fetchStorageData.fulfilled, handleFulfilled("storageData"))
      .addCase(fetchStorageData.rejected, handleRejected)
      .addCase(fetchWaterData.fulfilled, handleFulfilled("waterData"))
      .addCase(fetchWaterData.rejected, handleRejected)
      .addCase(fetchBusStopData.fulfilled, handleFulfilled("busStopData"))
      .addCase(fetchBusStopData.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
