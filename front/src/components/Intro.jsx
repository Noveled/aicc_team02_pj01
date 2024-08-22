import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Main from "./Main";

const Intro = () => {
  const authData = useSelector((state) => state.auth.authData);

  return (
    <div>
      {authData ? (
        <div>
          <Main></Main>
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
