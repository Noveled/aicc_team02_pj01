import React from "react";
import MyCourse from "../Filter/MyCourse";
import Like from "../Filter/Like";

const Box = () => {
  return (
    <div className="box-wrapper">
      <div className="flex justify-between">
        <button>나의 코스</button>
        <button>즐겨찾기</button>
      </div>
      <MyCourse></MyCourse>
      <Like></Like>
    </div>
  );
};

export default Box;
