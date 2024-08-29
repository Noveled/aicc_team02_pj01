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
      <div className="search-wrapper flex flex-col h-[93vh] overflow-y-scroll">
        <div className="search-item near">
          <h4 className="search-title">근처 추천 코스</h4>
          <div className="search-content border-sky-600">
            <Near></Near>
          </div>
        </div>

        <div className="search-item neighbor">
          <h4 className="search-title">지역 추천 코스</h4>
          <div className="search-content">
            <Neighbor></Neighbor>
          </div>
        </div>

        <div className="search-item walk">
          <h4 className="search-title">산책 추천 코스</h4>
          <div className="search-content">
            <Walk></Walk>
          </div>
        </div>

        <div className="search-item marathon">
          <h4 className="search-title">마라톤 추천 코스</h4>
          <div className="search-content">
            <Marathon></Marathon>
          </div>
        </div>

        <div className="search-item distance">
          <h4 className="search-title">거리별 코스</h4>
          <div className="search-content">
            <Distance></Distance>
          </div>
        </div>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default Search;
