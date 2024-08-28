import React from "react";
import Map from "./Map";
import Recommend from "./Recommend";
import FooterNaviBar from "./NaviBar/FooterNaviBar";
import MapBase from "./MapBase";

const Main = () => {
  return (
    <div className="main w-full h-[100vh]">
      <div className="h-[95vh] overflow-y-scroll">
        {/* 상단에 오늘의 추천 코스 보여주기 */}
        {/* <Recommend></Recommend> */}
        <div className="mapContainer">
          <MapBase />
          {/* 
          1. 앱 실행하면 현재 위치를 출력 ( 현재 위치정보 get )
          2. 마커 이용해서 기타 정보 표시? ( 러닝코스 시작점, 편의시설 3종 )
          3. 지도 다른 위치 보고 있다가 내위치로 이동하는 버튼 필요함. 
          4. +- 줌인 아웃 버튼 추가
          */}
        </div>
      </div>
      {/* 화면 하단에 내비 바 출력 */}
      <FooterNaviBar></FooterNaviBar> 
    </div>
  );
};

export default Main;
