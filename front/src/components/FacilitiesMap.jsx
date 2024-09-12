import React, { useState, useEffect } from "react";
import axios from "axios";

const { kakao } = window;

const FacilitiesMap = () => {
  const [map, setMap] = useState(null);
  const [infoOverlay, setInfoOverlay] = useState([]);
  // 각 마커가 표시될 좌표 배열
  const [faclilData, setFaclilData] = useState([]);

  const [type, setType] = useState("all");

  const [busstopDatas, setBusstopDatas] = useState([]);
  const [waterDatas, setWaterDatas] = useState([]);
  const [storageDatas, setStorageDatas] = useState([]);

  let markerImageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png"; // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
  const [busstopMarkers, setBusstopMarkers] = useState([]);
  const [waterMarkers, setWaterMarkers] = useState([]);
  const [storageMarkers, setStorageMarkers] = useState([]);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    const mapOptions = {
      center: new kakao.maps.LatLng(37.498004414546934, 127.02770621963765), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
    setMap(kakaoMap);
  }, []);

  useEffect(() => {
    // 커피숍 카테고리가 클릭됐을 때
    if (type === "busstop") {
      // 커피숍 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(map);
      printWaterMarkers(null);
      printStorageMarkers(null);
      console.log("커피숍 마커들만 지도에 표시하도록 설정합니다");
    } else if (type === "water") {
      // 편의점 카테고리가 클릭됐을 때
      // 편의점 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(null);
      printWaterMarkers(map);
      printStorageMarkers(null);
      console.log("편의점 마커들만 지도에 표시하도록 설정합니다");
    } else if (type === "storage") {
      // 주차장 카테고리가 클릭됐을 때
      // 주차장 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(null);
      printWaterMarkers(null);
      printStorageMarkers(map);
      console.log("주차장 마커들만 지도에 표시하도록 설정합니다");
    }
  }, [type]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_MY_DOMAIN}/get_facilities`)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          // navigate('/login');
          // console.log(res.data);
          setFaclilData(res.data);
        } else {
          alert("주변시설 정보 불러오기 실패했습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // setStoragePositions -> setStorageDatas
  // setWaterPositions -> setWaterDatas
  // setBusstopPositions -> setBusstopDatas
  useEffect(() => {
    faclilData.map((data) => {
      // console.log(data);
      const fac_data = {
        name: data.fac_name,
        info: data.location_detail,
        position: new kakao.maps.LatLng(data["latitude"], data["longitude"]),
      };
      // const position = new kakao.maps.LatLng(data['latitude'], data['longitude']);
      if (data["fac_type"] === "물품보관함") {
        setStorageDatas((prev) => [...prev, fac_data]);
      } else if (data["fac_type"] === "공원음수대") {
        setWaterDatas((prev) => [...prev, fac_data]);
      } else {
        //(data['fac_type'] === '버스정류장')
        setBusstopDatas((prev) => [...prev, fac_data]);
      }
    });
  }, [faclilData]);

  const getMarkers = () => {
    // console.log('getMarkers');
    createBusstopMarkers(); // 커피숍 마커를 생성하고 커피숍 마커 배열에 추가합니다
    createWaterMarkers(); // 편의점 마커를 생성하고 편의점 마커 배열에 추가합니다
    createStorageMarkers(); // 주차장 마커를 생성하고 주차장 마커 배열에 추가합니다
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
      position: fac_data.position,
      image: image,
    });

    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다
    const content = document.createElement("div");
    content.innerHTML = `<div class="wrap"> 
        <div class="info"> 
            <div class="title">
            ${fac_data.name}
                <div class="close" title="닫기"></div> 
            </div>
            <div class="body"> 
                <div class="img">
                    <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">
               </div>
                <div class="desc">
                    <div class="jibun ellipsis">${fac_data.info}</div>
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

    setInfoOverlay((prev) => [...prev, overlay]);
    return marker;
  };

  // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다
  // function closeOverlay() {
  //   infoOverlay.map((overlay) => {
  //     overlay.setMap(null);
  //   })
  // }

  // 커피숍 마커를 생성하고 커피숍 마커 배열에 추가하는 함수입니다
  const createBusstopMarkers = () => {
    setBusstopMarkers([]);
    for (let i = 0; i < busstopDatas.length; i++) {
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
        marker = createMarker(busstopDatas[i], markerImage);
      // 생성된 마커를 커피숍 마커 배열에 추가합니다
      setBusstopMarkers((prev) => [...prev, marker]);
    }
  };

  // 커피숍 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printBusstopMarkers = (map) => {
    for (let i = 0; i < busstopMarkers.length; i++) {
      busstopMarkers[i].setMap(map);
    }
  };

  // 편의점 마커를 생성하고 편의점 마커 배열에 추가하는 함수입니다
  const createWaterMarkers = () => {
    setWaterMarkers([]);
    for (let i = 0; i < waterDatas.length; i++) {
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
        marker = createMarker(waterDatas[i], markerImage);
      // 생성된 마커를 편의점 마커 배열에 추가합니다
      setWaterMarkers((prev) => [...prev, marker]);
    }
  };

  // 편의점 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printWaterMarkers = (map) => {
    for (let i = 0; i < waterMarkers.length; i++) {
      waterMarkers[i].setMap(map);
    }
  };

  // 주차장 마커를 생성하고 주차장 마커 배열에 추가하는 함수입니다
  const createStorageMarkers = () => {
    setStorageMarkers([]);
    for (let i = 0; i < storageDatas.length; i++) {
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
        marker = createMarker(storageDatas[i], markerImage);

      // 생성된 마커를 주차장 마커 배열에 추가합니다
      setStorageMarkers((prev) => [...prev, marker]);
    }
  };

  // 주차장 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printStorageMarkers = (map) => {
    for (let i = 0; i < storageMarkers.length; i++) {
      storageMarkers[i].setMap(map);
    }
  };

  const handleOnClickBtn = (type) => {
    setType(type);
  };

  // console.log(faclilData);
  // console.log(busstopMarkers);
  // console.log(carparkMarkers);
  // console.log(storeMarkers);
  // console.log(type);
  console.log(busstopMarkers);

  return (
    <div>
      <h2>Facilities Map</h2>
      <div id="map" style={{ width: "800px", height: "800px" }} />
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          marginLeft: "10px",
        }}
      >
        <button
          className="border border-gray-400 rounded-md p-1"
          onClick={getMarkers}
        >
          마커 생성하기
        </button>

        <button
          className="border border-gray-400 rounded-md p-1"
          onClick={() => handleOnClickBtn("busstop")}
        >
          버스정류장
        </button>
        <button
          className="border border-gray-400 rounded-md p-1"
          onClick={() => handleOnClickBtn("water")}
        >
          공원음수대
        </button>
        <button
          className="border border-gray-400 rounded-md p-1"
          onClick={() => handleOnClickBtn("storage")}
        >
          물품보관함
        </button>
      </div>
    </div>
  );
};

export default FacilitiesMap;
