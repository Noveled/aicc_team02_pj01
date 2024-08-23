import React from "react";

import FooterNaviBar from "./FooterNaviBar";

import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const MyPage = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="my-page">
      <div className="my-page-wrapper">
        <button onClick={handleLogout}>Log out</button>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default MyPage;
