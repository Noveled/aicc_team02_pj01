import React from "react";

import HeaderNaviBar from "../NaviBar/HeaderNaviBar";
import Map from "../Map";

const Detail = () => {
  return (
    <div className="detail">
      <HeaderNaviBar></HeaderNaviBar>

      <div className="detail-wrapper">
        <div></div>
      </div>

      <div className="detail-map">
        <Map className="detail-map"></Map>
      </div>
    </div>
  );
};

export default Detail;
