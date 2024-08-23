import React from "react";
import { Link } from "react-router-dom";

const FooterNaviBar = () => {
  return (
    <div className="footer-navi">
      <div className="footer-wrapper flex justify-between p-4">
        <button className="search btn">
          <Link to={"/search"}>탐색</Link>
        </button>

        <button className="make-course btn">
          <Link to={"/make_course"}>코스만들기</Link>
        </button>

        <button className="box btn">
          <Link to={"/box"}>보관함</Link>
        </button>

        <button className="my-page btn">
          <Link to={"/mypage"}>마이페이지</Link>
        </button>
      </div>
    </div>
  );
};

export default FooterNaviBar;
