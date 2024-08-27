import React, { useState } from "react";
import MyCourse from "../Filter/MyCourse";
import Like from "../Filter/Like";
import FooterNaviBar from "./FooterNaviBar";

const Box = () => {
  const [myCourse, setMyCourse] = useState(true);
  const [like, setLike] = useState(false);

  const handleMyCourse = () => {
    if (myCourse) {
      return;
    } else {
      setMyCourse(true);
      setLike(false);
    }
  };
  const handleLike = () => {
    if (like) {
      return;
    } else {
      setLike(true);
      setMyCourse(false);
    }
  };

  return (
    <div className="box">
      <div className="box-wrapper h-[95vh] overflow-y-scroll">
        <div className="flex justify-between">
          <button onClick={handleMyCourse} className="btn">
            나의 코스
          </button>
          <button onClick={handleLike} className="btn">
            즐겨찾기
          </button>
        </div>
        {myCourse ? <MyCourse></MyCourse> : <Like></Like>}
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default Box;
