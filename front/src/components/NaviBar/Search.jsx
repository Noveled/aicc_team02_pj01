import React from "react";

// Components
import FooterNaviBar from "./FooterNaviBar";
import Category from "./Category";

const Search = () => {
  const category_title = [
    "근처 추천 코스",
    "지역 추천 코스",
    "산책 추천 코스",
    "마라톤 추천 코스",
    "거리별 코스",
  ];
  return (
    <div className="search">
      <div className="search-wrapper flex flex-col h-[93vh] overflow-y-scroll">
        {category_title.map((title, index) => (
          <Category key={index} title={title}></Category>
        ))}
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default Search;
