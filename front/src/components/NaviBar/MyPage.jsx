import React from "react";

import FooterNaviBar from "./FooterNaviBar";

import { logout } from "../../redux/slices/authSlice";
import { deleteUserInfo } from "../../redux/slices/userInfoSlice";

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const MyPage = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(deleteUserInfo());
  };
  return (
    <div className="my-page">
      <div className="my-page-wrapper">
        <Link to={"/"}>
          <button onClick={handleLogout} className="">
            Log out
          </button>
        </Link>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default MyPage;
