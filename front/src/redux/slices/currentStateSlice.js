import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

// initial state
const initialState = {
  currentPage: Cookies.get('currentPage')
    ? JSON.parse(Cookies.get('currentPage')) 
    : { title: "주변", }, 
  mapInfo: Cookies.get('mapInfo')
    ? JSON.parse(Cookies.get('mapInfo')) 
    : { center: {"La": 126.88632837397479, "Ma": 37.47362576352418}, 
    lv: 3 }, 

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
      Cookies.set('currentPage', JSON.stringify(action.payload), {
        expires: 1, // 1일 쿠키 유효기간
      });
    },
    changeMapInfo: (state, action) => {
      state.mapInfo = action.payload;
      Cookies.set('mapInfo', JSON.stringify(action.payload), {
        expires: 1, // 1일 쿠키 유효기간
      });
    }
  },
  extraReducers: (builder) => {
    // 여기에 추가적으로 비동기 액션들을 처리할 수 있음
  },
});

// 액션과 리듀서를 export
export const { changeCurrentPage, changeMapInfo } = currentStateSlice.actions;
export default currentStateSlice.reducer;
