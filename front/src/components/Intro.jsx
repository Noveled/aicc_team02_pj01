import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const Intro = () => {
  const authData = useSelector((state) => state.auth.authData);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {authData ? (
        <div>
          <p>{authData.name}님 로그인</p>
          <button onClick={handleLogout}>log out</button>
        </div>
      ) : (
        <div>
          <p>로그인 해주세요</p>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Intro;
