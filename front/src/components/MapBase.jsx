import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchGetCourseData,
  fetchStorageData,
  fetchWaterData,
  fetchBusStopData,
} from "../redux/slices/apiSlice";
import { changeMapInfo } from "../redux/slices/currentStateSlice";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Loader } from "lucide-react";
import { BusFront } from "lucide-react";
import { GlassWater } from "lucide-react";
import { ArchiveRestore } from "lucide-react";
import { MapPinned } from "lucide-react";
import { Eraser } from "lucide-react";
import { Crosshair } from "lucide-react";
import { Sun } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import Recommend from "./Recommend";

const { kakao } = window;

const MapBase = () => {
  const [map, setMap] = useState(null);
  const mapInfo = useSelector((state) => state.currentState.mapInfo);
  const [infoOverlay, setInfoOverlay] = useState([]);
  // 각 마커가 표시될 좌표 배열

  const [type, setType] = useState("all");

  let markerImageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
  const [busstopMarkers, setBusstopMarkers] = useState([]);
  const [waterMarkers, setWaterMarkers] = useState([]);
  const [storageMarkers, setStorageMarkers] = useState([]);
  const [firstPointMarkers, setFirstPointMarkers] = useState([]);

  // 유저 마커 상태관리
  const [userMarker, setUserMarker] = useState();

  // 클릭 상태 관리
  const [isClickedZoomIn, setIsClickedZoomIn] = useState(false);
  const [isClickedZoomOut, setIsClickedZoomOut] = useState(false);
  const [isClickedPanTo, setIsClickedPanTo] = useState(false);

  const dispatch = useDispatch();
  const stateCourseData = useSelector((state) => state.api.getCourseData);
  const stateStorageData = useSelector((state) => state.api.storageData);
  const stateWaterData = useSelector((state) => state.api.waterData);
  const stateBusStopData = useSelector((state) => state.api.busStopData);

  useEffect(() => {
    dispatch(fetchGetCourseData());
    dispatch(fetchStorageData());
    dispatch(fetchWaterData());
    dispatch(fetchBusStopData());
  }, [dispatch]);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    // console.log("mapContainer :", mapContainer);
    // console.log("kakao :", kakao);
    // console.log("window: ", window);

    const mapOptions = {
      center: new kakao.maps.LatLng(mapInfo.center["Ma"], mapInfo.center["La"]),
      level: mapInfo.lv,
    };

    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
    setMap(kakaoMap);
  }, []);

  useEffect(() => {
    const startSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png", // 유저 마커이미지의 주소입니다
      startSize = new kakao.maps.Size(50, 45), // 유저 마커이미지의 크기입니다
      startOption = {
        offset: new kakao.maps.Point(15, 43), // 유저 마커이미지에서 마커의 좌표에 일치시킬 좌표를 설정합니다 (기본값은 이미지의 가운데 아래입니다)
      };
    // 유저 마커 이미지를 생성합니다
    const userMarkerImage = new kakao.maps.MarkerImage(
      startSrc,
      startSize,
      startOption
    );

    const userMarkerDragSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_drag.png", // 유저 마커의 드래그 이미지 주소입니다
      userMarkerSize = new kakao.maps.Size(50, 64), // 유저 마커의 드래그 이미지 크기입니다
      userMarkerDragOption = {
        offset: new kakao.maps.Point(15, 54), // 유저 마커의 드래그 이미지에서 마커의 좌표에 일치시킬 좌표를 설정합니다 (기본값은 이미지의 가운데 아래입니다)
      };

    // 유저 마커의 드래그 이미지를 생성합니다
    const userMarkerDragImage = new kakao.maps.MarkerImage(
      userMarkerDragSrc,
      userMarkerSize,
      userMarkerDragOption
    );

    // 유저 마커를 생성합니다
    const userMarker = new kakao.maps.Marker({
      map: map, // 출발 마커가 지도 위에 표시되도록 설정합니다
      position: new kakao.maps.LatLng(37.48071191757761, 126.88145603954914),
      draggable: true, // 출발 마커가 드래그 가능하도록 설정합니다
      image: userMarkerImage, // 유저 마커이미지를 설정합니다
    });

    setUserMarker(userMarker);

    // 유저 마커에 dragstart 이벤트를 등록합니다
    kakao.maps.event.addListener(userMarker, "dragstart", function () {
      // 유저 마커의 드래그가 시작될 때 마커 이미지를 변경합니다
      userMarker.setImage(userMarkerDragImage);
    });

    // 유저 마커에 dragend 이벤트를 등록합니다
    kakao.maps.event.addListener(userMarker, "dragend", function () {
      // 출발 마커의 드래그가 종료될 때 마커 이미지를 원래 이미지로 변경합니다
      userMarker.setImage(userMarkerImage);
      // console.log('userMarker', userMarker['n']);
    });

    userMarker.setMap(map);

    // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    if (map) {
      kakao.maps.event.addListener(map, "dragend", function () {
        // 지도 중심좌표를 얻어옵니다
        const latlng = map.getCenter();
        const mapLv = map.getLevel();
        dispatch(changeMapInfo({ center: latlng, lv: mapLv }));
      });
    }
  }, [map]);

  // useEffect(() => {
  //   if (busstopMarkers.length > 0) {
  //     getMarkers();
  //   }
  // }, [busstopMarkers])

  useEffect(() => {
    // 버스정류장 카테고리가 클릭됐을 때
    if (type === "busstop") {
      // 버스정류장 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(map);
      printWaterMarkers(null);
      printStorageMarkers(null);
      printFirstPointMarkers(null);
      console.log("버스정류장 마커들만 지도에 표시하도록 설정합니다");
    } else if (type === "water") {
      // 공원음수대 카테고리가 클릭됐을 때
      // 공원음수대 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(null);
      printWaterMarkers(map);
      printStorageMarkers(null);
      printFirstPointMarkers(null);
      console.log("공원음수대 마커들만 지도에 표시하도록 설정합니다");
    } else if (type === "storage") {
      // 물품보관함 카테고리가 클릭됐을 때
      // 물품보관함 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(null);
      printWaterMarkers(null);
      printStorageMarkers(map);
      printFirstPointMarkers(null);
      console.log("물품보관함 마커들만 지도에 표시하도록 설정합니다");
    } else if (type === "point") {
      printBusstopMarkers(null);
      printWaterMarkers(null);
      printStorageMarkers(null);
      printFirstPointMarkers(map);
      console.log("출발지 마커들만 지도에 표시하도록 설정합니다");
    } else if (type === "clear") {
      printBusstopMarkers(null);
      printWaterMarkers(null);
      printStorageMarkers(null);
      printFirstPointMarkers(null);
      console.log("화면의 마커들 정리");
    }
  }, [type]);

  // 버튼 클릭되면 실행
  useEffect(() => {
    if (isClickedZoomIn) {
      const timer = setTimeout(() => {
        setIsClickedZoomIn(false);
      }, 200); // 200ms 후에 원래 배경색으로 복원
      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [isClickedZoomIn]);

  useEffect(() => {
    if (isClickedZoomOut) {
      const timer = setTimeout(() => {
        setIsClickedZoomOut(false);
      }, 200); // 200ms 후에 원래 배경색으로 복원
      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [isClickedZoomOut]);

  useEffect(() => {
    if (isClickedPanTo) {
      const timer = setTimeout(() => {
        setIsClickedPanTo(false);
      }, 200); // 200ms 후에 원래 배경색으로 복원
      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [isClickedPanTo]);

  const getMarkers = () => {
    // console.log('getMarkers');
    createBusstopMarkers(); // 커피숍 마커를 생성하고 커피숍 마커 배열에 추가합니다
    createWaterMarkers(); // 편의점 마커를 생성하고 편의점 마커 배열에 추가합니다
    createStorageMarkers(); // 주차장 마커를 생성하고 주차장 마커 배열에 추가합니다
    createFirstPointMarkers();
  };

  // 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
  const createMarkerImage = (src, size, options) => {
    let markerImage = new kakao.maps.MarkerImage(src, size, options);
    return markerImage;
  };

  // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
  const createMarker = (fac_data, image) => {
    // console.log(fac_data);
    let marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(
        fac_data["latitude"],
        fac_data["longitude"]
      ),
      image: image,
    });

    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다
    const content = document.createElement("div");
    content.innerHTML = `<div class="wrap"> 
        <div class="info"> 
            <div class="title">
            ${fac_data.fac_name}
                <div class="close" title="닫기"></div> 
            </div>
            <div class="body"> 
                <div class="img">
                    <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">
               </div>
                <div class="desc">
                    <div class="jibun ellipsis">${fac_data.location_detail}</div>
                </div>
            </div>

        </div>
    </div>`;

    // 마커 위에 커스텀오버레이를 표시합니다
    // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
    const overlay = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: marker.getPosition(),
    });

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, "click", function () {
      overlay.setMap(map);
    });

    overlay.setMap(null); // 기본은 닫고 시작

    // 닫기 버튼 이벤트 추가
    const closeBtn = content.querySelector(".close");
    closeBtn.addEventListener("click", function () {
      overlay.setMap(null);
    });

    return marker;
  };

  // 출발지 마커 생성
  // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
  const createFirstPointMarker = (course_data, image) => {
    const first_LatLng = course_data["waypoint"][0];
    // console.log(first_LatLng['Ma'], first_LatLng['La']);

    let marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(first_LatLng["Ma"], first_LatLng["La"]),
      image: image,
    });

    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다
    const content = document.createElement("div");
    content.innerHTML = `<div class="wrap"> 
        <div class="info"> 
            <div class="title">
            ${course_data.course_name}
                <div class="close" title="닫기"></div> 
            </div>
            <div class="body"> 
                <div class="img">
                    <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">
               </div>
                <div class="desc">
                    <div class="jibun ellipsis">${course_data.content}</div>
                </div>
            </div>

        </div>
    </div>`;

    // 마커 위에 커스텀오버레이를 표시합니다
    // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
    const overlay = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: marker.getPosition(),
    });

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, "click", function () {
      overlay.setMap(map);
    });

    overlay.setMap(null); // 기본은 닫고 시작

    // 닫기 버튼 이벤트 추가
    const closeBtn = content.querySelector(".close");
    closeBtn.addEventListener("click", function () {
      overlay.setMap(null);
    });

    return marker;
  };

  // 버스정류장 마커를 생성하고 버스정류장 마커 배열에 추가하는 함수입니다
  const createBusstopMarkers = () => {
    setBusstopMarkers([]);
    for (let i = 0; i < stateBusStopData.length; i++) {
      let imageSize = new kakao.maps.Size(22, 26),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(10, 0),
          spriteSize: new kakao.maps.Size(36, 98),
        };
      // 마커이미지와 마커를 생성합니다
      let markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(stateBusStopData[i], markerImage);
      // 생성된 마커를 버스정류장 마커 배열에 추가합니다
      setBusstopMarkers((prev) => [...prev, marker]);
    }
  };

  // 버스정류장 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printBusstopMarkers = (map) => {
    for (let i = 0; i < busstopMarkers.length; i++) {
      busstopMarkers[i].setMap(map);
    }
  };

  // 공원음수대 마커를 생성하고 공원음수대 마커 배열에 추가하는 함수입니다
  const createWaterMarkers = () => {
    setWaterMarkers([]);
    for (let i = 0; i < stateWaterData.length; i++) {
      let imageSize = new kakao.maps.Size(22, 26),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(10, 36),
          spriteSize: new kakao.maps.Size(36, 98),
        };

      // 마커이미지와 마커를 생성합니다
      let markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(stateWaterData[i], markerImage);
      // 생성된 마커를 공원음수대 마커 배열에 추가합니다
      setWaterMarkers((prev) => [...prev, marker]);
    }
  };

  // 공원음수대 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printWaterMarkers = (map) => {
    for (let i = 0; i < waterMarkers.length; i++) {
      waterMarkers[i].setMap(map);
    }
  };

  // 물품보관함 마커를 생성하고 물품보관함 마커 배열에 추가하는 함수입니다
  const createStorageMarkers = () => {
    setStorageMarkers([]);
    for (let i = 0; i < stateStorageData.length; i++) {
      let imageSize = new kakao.maps.Size(22, 26),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(10, 72),
          spriteSize: new kakao.maps.Size(36, 98),
        };

      // 마커이미지와 마커를 생성합니다
      let markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createMarker(stateStorageData[i], markerImage);

      // 생성된 마커를 물품보관함 마커 배열에 추가합니다
      setStorageMarkers((prev) => [...prev, marker]);
    }
  };

  // 물품보관함 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printStorageMarkers = (map) => {
    for (let i = 0; i < storageMarkers.length; i++) {
      storageMarkers[i].setMap(map);
    }
  };

  // 출발지 마커를 생성하고 물품보관함 마커 배열에 추가하는 함수입니다
  const createFirstPointMarkers = () => {
    setFirstPointMarkers([]);
    for (let i = 0; i < stateCourseData.length; i++) {
      let imageSize = new kakao.maps.Size(22, 26),
        imageOptions = {
          spriteOrigin: new kakao.maps.Point(10, 72),
          spriteSize: new kakao.maps.Size(36, 98),
        };

      // 마커이미지와 마커를 생성합니다
      let markerImage = createMarkerImage(
          markerImageSrc,
          imageSize,
          imageOptions
        ),
        marker = createFirstPointMarker(stateCourseData[i], markerImage);

      // 생성된 마커를 물품보관함 마커 배열에 추가합니다
      setFirstPointMarkers((prev) => [...prev, marker]);
    }
  };

  // 출발지 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printFirstPointMarkers = (map) => {
    // console.log("출발지 마커 표시 중...", firstPointMarkers);
    for (let i = 0; i < firstPointMarkers.length; i++) {
      firstPointMarkers[i].setMap(map);
    }
  };

  const handleOnClickBtn = (type) => {
    setType(type);
  };

  // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
  const zoomIn = () => {
    map.setLevel(map.getLevel() - 1);
    setIsClickedZoomIn(true);
  };

  // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
  const zoomOut = () => {
    map.setLevel(map.getLevel() + 1);
    setIsClickedZoomOut(true);
  };

  const panTo = () => {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = userMarker["n"];
    // new kakao.maps.LatLng(33.452613, 126.570888);
    setIsClickedPanTo(true);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  };

  const panToUser = () => {
    panTo();
  };

  var settings = {
    // dots: true,
    infinite: false,
    speed: 300,
    slidesToScroll: 4,
    slidesToShow: 4,
    variableWidth: true,
  };

  // console.log(stateStorageData);
  // console.log(busstopMarkers);
  // console.log(firstPointMarkers);
  // console.log(userMarker);

  return (
    <div className="h-full w-full">
      <div
        id="map"
        className="relative"
        style={{ width: "100%", height: "100%" }}
      />

      {/* 이벤트 배너 */}
      <Recommend />

      {/* 내 위치로 이동 */}
      <div className="absolute bottom-24 left-[14px] z-10">
        <button onClick={() => panToUser()}>
          <span className="relative flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full border border-gray-200 shadow-lg">
            <Crosshair
              className={`transition-colors duration-200 ${
                isClickedPanTo ? "text-[#7c5ecf]" : "text-[#c8b5fc]"
              }`}
            />
            <span className="absolute h-[3px] w-[3px] bg-[#c8b5fc] rounded-3xl"></span>
          </span>
        </button>
      </div>

      {/* 날씨 */}
      <a
        className="absolute bottom-36 left-[14px] z-10"
        href="https://weather.naver.com/"
      >
        <span className="relative flex items-center justify-center w-[40px] h-auto p-2 bg-white rounded-full border border-gray-200 shadow-lg">
          <div className="flex flex-col">
            <Sun className="text-orange-400" />
            <span className="font-bold">33°</span>
            <span
              className="w-6 h-[2px] min-w-max
            rounded-md shadow-md bg-[#0ea5e9]"
            ></span>
            <span className="text-center text-[10px] text-blue-400">미세</span>
          </div>
        </span>
      </a>

      {/* 줌 인아웃 */}
      <div className="absolute flex flex-col gap-1 top-20 right-3 z-10">
        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg transition-colors duration-200 ${
            isClickedZoomIn ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => zoomIn()}
        >
          <Plus className="h-[22px] w-[22px] text-[#c8b5fc]" />
        </button>

        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg transition-colors duration-200 ${
            isClickedZoomOut ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => zoomOut()}
        >
          <Minus className="h-[22px] w-[22px] text-[#c8b5fc]" />
        </button>
      </div>

      {/* 카테고리 슬라이더 */}
      <div className="absolute top-8 z-10 text-[12px] font-semibold text-[#232323]">
        <Slider {...settings}>
          <div className="mx-[2px]">
            <button
              className="border border-gray-200 bg-white rounded-full py-1 px-2 mx-2 shadow"
              onClick={getMarkers}
            >
              <div className="flex gap-[1px] justify-center items-center">
                <Loader className="text-orange-400 h-[14px]" />
                <span className="text-[12px] whitespace-nowrap">로드</span>
              </div>
            </button>
          </div>
          <div className="mx-[2px]">
            <button
              className={`{border border-gray-200 bg-white rounded-full py-1 px-2 shadow ${
                type === "busstop" && "bg-slate-200"
              }`}
              onClick={() => handleOnClickBtn("busstop")}
            >
              <div className="flex gap-[1px] justify-center items-center">
                <BusFront className="text-green-500 h-[14px]" />
                <span
                  className={`text-[12px] whitespace-nowrap ${
                    type === "busstop" && "text-sky-500"
                  }`}
                >
                  버스정류장
                </span>
              </div>
            </button>
          </div>
          <div className="mx-[2px]">
            <button
              className={`{border border-gray-200 bg-white rounded-full py-1 px-2 shadow ${
                type === "water" && "bg-slate-200"
              }`}
              onClick={() => handleOnClickBtn("water")}
            >
              <div className="flex gap-[1px] justify-center items-center">
                <GlassWater className="text-blue-500 h-[14px]" />
                <span
                  className={`text-[12px] whitespace-nowrap ${
                    type === "water" && "text-sky-500"
                  }`}
                >
                  공원음수대
                </span>
              </div>
            </button>
          </div>
          <div className="mx-[2px]">
            <button
              className={`{border border-gray-200 bg-white rounded-full py-1 px-2 shadow ${
                type === "storage" && "bg-slate-200"
              }`}
              onClick={() => handleOnClickBtn("storage")}
            >
              <div className="flex gap-[1px] justify-center items-center">
                <ArchiveRestore className="text-violet-500 h-[14px]" />
                <span
                  className={`text-[12px] whitespace-nowrap ${
                    type === "storage" && "text-sky-500"
                  }`}
                >
                  물품보관함
                </span>
              </div>
            </button>
          </div>
          <div className="mx-[2px]">
            <button
              className={`{border border-gray-200 bg-white rounded-full py-1 px-2 shadow ${
                type === "point" && "bg-slate-200"
              }`}
              onClick={() => handleOnClickBtn("point")}
            >
              <div className="flex gap-[1px] justify-center items-center">
                <MapPinned className="text-red-500 h-[14px]" />
                <span
                  className={`text-[12px] whitespace-nowrap ${
                    type === "point" && "text-sky-500"
                  }`}
                >
                  출발지
                </span>
              </div>
            </button>
          </div>
          <div className="mx-[2px]">
            <button
              className={`{border border-gray-200 bg-white rounded-full py-1 px-2 shadow ${
                type === "clear" && "bg-slate-200"
              }`}
              onClick={() => handleOnClickBtn("clear")}
            >
              <div className="flex gap-[1px] justify-center items-center">
                <Eraser className="text-gray-500 h-[14px]" />
                <span
                  className={`text-[12px] whitespace-nowrap ${
                    type === "clear" && "text-sky-500"
                  }`}
                >
                  지우기
                </span>
              </div>
            </button>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default MapBase;
