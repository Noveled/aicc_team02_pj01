import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

// initial state
const initialState = {
  userInfo: Cookies.get('userInfo')
  ? JSON.parse(Cookies.get('userInfo')) 
  : null,
  isError: false,
};

// createSlice
const userInfoSlice = createSlice({
  name: "userInfoState",
  initialState,
  reducers: {
    // 동기 액션으로 currentPage 변경
    updateUserInfo: (state, action) => {
      // console.log('action.payload', action.payload);
      // console.log('state.userInfo', state.userInfo);
      
      // 나머지 속성은 유지하면서 업데이트
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
      Cookies.set('userInfo', JSON.stringify(action.payload), {
        expires: 1, // 1일 쿠키 유효기간
      });

      // console.log('state.userInfo', state.userInfo);
    },
    deleteUserInfo: (state) => {
      // 로그아웃시 상태값 비움
      state.userInfo = null;
      Cookies.remove('userInfo');
    },
  },
  extraReducers: (builder) => {
    // 여기에 추가적으로 비동기 액션들을 처리할 수 있음
  },
});

// 액션과 리듀서를 export
export const { updateUserInfo, deleteUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;

