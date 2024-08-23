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
        <div className="w-full flex justify-between">
          <div>INTRO</div>
          <button className="p-4">
            <Link to="/login">Login</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Intro;
