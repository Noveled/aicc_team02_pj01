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
      <div className="box-wrapper h-[93vh] overflow-y-scroll">
        <div className="flex">
          <button
            onClick={handleMyCourse}
            className={`py-4 basis-1/2 shrink-0 text-xl text-gray-500 hover:font-bold ${
              myCourse &&
              "border-b-2 border-purple-500 text-purple-500 font-bold"
            }`}
          >
            나의 코스
          </button>
          <button
            onClick={handleLike}
            className={`py-4 basis-1/2 shrink-0 text-xl text-gray-500 hover:font-bold ${
              like && "border-b-2 border-purple-500 text-purple-500 font-bold"
            }`}
          >
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
