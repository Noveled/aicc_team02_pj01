import React from "react";
import Near from "../Category/Near";
import Neighbor from "../Category/Neighbor";
import Distance from "../Category/Distance";
import Walk from "../Category/Walk";
import Marathon from "../Category/Marathon";

const Search = () => {
  return (
    <div className="search">
      <div className="search-wrapper flex flex-col gap-y-10">
        <div className="search-item near">
          <h4>근처 추천 코스</h4>
          <div>
            <Near></Near>
          </div>
        </div>

        <div className="search-item neighbor">
          <h4>지역 추천 코스</h4>
          <div>
            <Neighbor></Neighbor>
          </div>
        </div>

        <div className="search-item distance">
          <h4>거리별 코스</h4>
          <div>
            <Distance></Distance>
          </div>
        </div>

        <div className="search-item walk">
          <h4>산책 추천 코스</h4>
          <div>
            <Walk></Walk>
          </div>
        </div>

        <div className="search-item marathon">
          <h4>마라톤 추천 코스</h4>
          <div>
            <Marathon></Marathon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
