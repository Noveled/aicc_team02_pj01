// 1. 슬라이스 생성
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  authData: Cookies.get("authData")
    ? JSON.parse(Cookies.get("authData"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // 업데이트 상태값 변경
      state.authData = action.payload.authData;
      Cookies.set("authData", JSON.stringify(action.payload.authData), {
        expires: 1,
      });
    },
    logout: (state) => {
      // 상태값 비움
      state.authData = null;
      Cookies.remove("authData");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; // 4. export된 함수들을 store에 등록
