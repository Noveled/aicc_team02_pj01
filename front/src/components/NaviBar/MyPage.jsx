import React from "react";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const MyPage = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      <div>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
};

export default MyPage;
