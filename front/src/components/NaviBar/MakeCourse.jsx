import React, { useEffect, useState } from "react";
// import FooterNaviBar from "./FooterNaviBar";
import Map from "../Map";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import HeaderNaviBar from "./HeaderNaviBar";

import { ChevronLeft } from 'lucide-react';
import { PenLine } from 'lucide-react';

// 
const { kakao } = window;

const MakeCourse = () => {

  // 마커 이미지
  const imageSrc =
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

  const [map, setMap] = useState(null); // 지도 상태관리
  const [markers, setMarkers] = useState([]); // 마커
  const [linePath, setLinePath] = useState([]); // 폴리라인

  // 마커, 폴리라인 추가
  const addLinePath = (position) => {
    const path = new kakao.maps.LatLng(position.Ma, position.La);
    setLinePath((prevPath) => [...prevPath, path]);
  };

  const addMarker = (position) => {
    const marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  // 배열에 추가된 마커들을 지도에 표시하거나 삭제
  const printMarkers = (map) => {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  // 맵 api 불러오고 클릭 이벤트 리스너 추가
  useEffect(() => {
    const mapContainer = document.getElementById('map');
    const mapOptions = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
    setMap(kakaoMap);

    window.kakao.maps.event.addListener(kakaoMap, 'click', (mouseEvent) => {
      const position = mouseEvent.latLng;
      addMarker(position);
      addLinePath(position);
    });
  }, []);

  useEffect(() => {
    // if (map !== null) {
    //   const center = map.getCenter();
    //   const lv = map.getLevel();
    //   setValues({ ...values, waypoint: linePath, center: center, level: lv });
    // }

    if (map && linePath.length > 0) {
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#FFAE00',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);
      printMarkers(map);

      return () => polyline.setMap(null);
    }
  }, [linePath, map]);

  return (
    <div className="make-course">
      {/* 헤더 영역 */}
      <div className="absolute w-full flex justify-between items-center py-4 px-6">
        <div>
          <ChevronLeft className="w-8 h-8" />
        </div>
        <div className="relative">
          <span className='absolute flex justify-center items-center h-[36px] w-[36px] bg-sky-500 rounded-3xl -bottom-1 -left-2'>
            <PenLine className="text-white" />
          </span>
          <span className="border rounded-3xl px-8 py-[6px] bg-slate-600 text-white font-bold">지도를 눌러 코스를 그려주세요.</span>
        </div>
      </div>

    </div>
  );
};

export default MakeCourse;
