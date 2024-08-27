import React from "react";
import Map from "./Map";
import Recommend from "./Recommend";
import FooterNaviBar from "./NaviBar/FooterNaviBar";

const Main = () => {
  return (
    <div className="main w-full h-[100vh]">
      <div className="h-[95vh] overflow-y-scroll">
        <Recommend></Recommend>
        <div className="map">
          <Map></Map>
        </div>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default Main;
