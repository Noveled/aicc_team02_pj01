import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  currentPage: { title: "주변", },
  isError: false,
};

// createSlice
const currentStateSlice = createSlice({
  name: "currentState",
  initialState,
  reducers: {
    // 동기 액션으로 currentPage 변경
    changeCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 여기에 추가적으로 비동기 액션들을 처리할 수 있음
  },
});

// 액션과 리듀서를 export
export const { changeCurrentPage } = currentStateSlice.actions;
export default currentStateSlice.reducer;
