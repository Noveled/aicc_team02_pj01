import React from "react";

// Components
import Near from "../Category/Near";
import Neighbor from "../Category/Neighbor";
import Distance from "../Category/Distance";
import Walk from "../Category/Walk";
import Marathon from "../Category/Marathon";
import FooterNaviBar from "./FooterNaviBar";

const Search = () => {
  return (
    <div className="search">
      <div className="search-wrapper flex flex-col gap-y-10 p-4">
        <div className="search-item near">
          <h4>근처 추천 코스</h4>
          <Near></Near>
        </div>

        <div className="search-item neighbor">
          <h4>지역 추천 코스</h4>
          <Neighbor></Neighbor>
        </div>

        <div className="search-item distance">
          <h4>거리별 코스</h4>
          <Distance></Distance>
        </div>

        <div className="search-item walk">
          <h4>산책 추천 코스</h4>
          <Walk></Walk>
        </div>

        <div className="search-item marathon">
          <h4>마라톤 추천 코스</h4>
          <Marathon></Marathon>
        </div>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default Search;
