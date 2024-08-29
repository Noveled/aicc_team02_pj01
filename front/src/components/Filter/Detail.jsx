import React from "react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import HeaderNaviBar from "../NaviBar/HeaderNaviBar";
import Map from "../Map";

const Detail = () => {
  const userName = useSelector((state) => state.auth.authData.name);

  const location = useLocation();
  const item = location.state.item;

  return (
    <div className="detail">
      <HeaderNaviBar></HeaderNaviBar>

      <div className="detail-wrapper">
        <div></div>
        {/* <div className="flex text-sm gap-4">
          <button>
            <FaEdit />
          </button>
          <button onClick={deleteItem}>
            <FaTrash />
          </button>
        </div> */}
      </div>

      <Map className="detail-map"></Map>
    </div>
  );
};

export default Detail;
