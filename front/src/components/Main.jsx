import React from "react";
import Map from "./Map";
import Recommend from "./Recommend";
import FooterNaviBar from "./NaviBar/FooterNaviBar";

const Main = () => {
  return (
    <div className="main w-full h-[100vh] relative">
      <div className="flex flex-col justify-between w-full h-[100vh]">
        <div>
          <Recommend></Recommend>
        </div>
        <div>
          <FooterNaviBar></FooterNaviBar>
        </div>
      </div>

      <div className="map w-full h-[100vh] absolute">
        <Map></Map>
      </div>
    </div>
  );
};

export default Main;
