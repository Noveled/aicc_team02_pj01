import React from "react";
import Map from "./Map";
import Recommend from "./Recommend";
import FooterNaviBar from "./NaviBar/FooterNaviBar";

const Main = () => {
  return (
    <div className="main w-full h-[100vh]">
      <div>
        <Recommend></Recommend>
        <FooterNaviBar></FooterNaviBar>
        <div className="map">
          <Map></Map>
        </div>
      </div>
    </div>
  );
};

export default Main;
