import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ChevronLeft } from 'lucide-react';
import { PenLine } from 'lucide-react';
import { Minus } from 'lucide-react';

import '../../actions.css';

// 
const { kakao } = window;

const MakeCourse = () => {
  // 유저 정보 불러오기
  const dispatch = useDispatch();
  // const [userData, setUserData] = useState();
  const userData = useSelector((state) => state.userInfoState);
  console.log('userData', userData);

  // 마커 이미지
  const startSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png';
  const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
  const imageSize = new kakao.maps.Size(32, 34); // 마커이미지의 크기입니다
  const imageOption = {offset: new kakao.maps.Point(18, 32)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  const [map, setMap] = useState(null); // 지도 상태관리
  const [markers, setMarkers] = useState([]); // 마커
  const [linePath, setLinePath] = useState([]); // 폴리라인
  const [isMakeCoursePop, setIsMakeCoursePop] = useState(false); // 등록창 팝업 여부

  // 코스 등록시 필요한 값
  const [values, setValues] = useState({
    course_name: '',
    user_id: '', 
    distance: '',
    waypoint: linePath,
    city: '',
    is_private: false,
    url: '',
    center: '',
    level: '',
  });

  // 마커, 폴리라인 추가
  const addLinePath = (position) => {
    const path = new kakao.maps.LatLng(position.Ma, position.La);
    setLinePath((prevPath) => [...prevPath, path]);
  };
  
  // useState의 prevState를 사용하여 리액트 렌더링 없이 마커 상태 업데이트
  const addMarker = (position) => {
    setMarkers((prevMarkers) => {
      let markerImage;
      
      if (prevMarkers.length === 0) {
        // console.log('출발마커');
        markerImage = new kakao.maps.MarkerImage(startSrc, imageSize, imageOption);
      } else {
        // console.log('중간마커');
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      }
  
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        position: position,
        image: markerImage // 마커이미지 설정 
      });
      marker.setMap(map);
  
      // 이전 마커들에 현재 마커를 추가하여 새로운 배열 반환
      return [...prevMarkers, marker];
    });
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
      center: new kakao.maps.LatLng(37.48081191757761, 126.88385603954914),
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

  // values의 waypoint, center, level 값 갱신 &
  // 맵 위에 마커, 폴리라인 그리기
  useEffect(() => {
    if (map !== null) {
      const center = map.getCenter();
      const lv = map.getLevel();
      setValues({ ...values, waypoint: linePath, center: center, level: lv });
    }

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


  // 버튼 기능 구현 파트

  // 모든 마커 지우기
  const clearAllMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    setLinePath([]);
  };

  // 마지막에 추가된 마커 지우기
  const deleteLastMarker = () => {
    if (markers.length > 0) {
      const lastMarker = markers[markers.length - 1];
      lastMarker.setMap(null);

      setMarkers(markers.slice(0, -1));
      setLinePath(linePath.slice(0, -1));
    }
  };

  const toggleMakeCoursePop = () => {
    console.log('isMakeCoursePop Click :', isMakeCoursePop);
    setIsMakeCoursePop(!isMakeCoursePop)
  }

  const handlePostCourse = (e) => {
    e.preventDefault();
    console.log(values);
  }


  return (
    <div className="make-course">
      {/* 헤더 영역 */}
      <div className="absolute w-full flex justify-between items-center py-4 px-6 z-10">
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
      {/* 카카오 맵 */}
      <div id="map" style={{ width: '800px', height: '900px' }}></div>


      {/* 버튼 */}
      <div className="absolute flex flex-col gap-1 bottom-20 right-3 z-10">

        {/* 마커 모두 지우기 */}
        <button className={`border border-gray-200 rounded-full p-1 shadow-lg bg-white`} // transition-colors duration-200 ${ isClickedZoomOut ? 'bg-gray-200' : 'bg-white' }
        onClick={() => clearAllMarkers()}>
          <Minus  className='h-[30px] w-[30px] text-[#888888]' />
        </button>

        {/* 마커 하나 지우기 */}
        <button className={`border border-gray-200 rounded-full p-1 shadow-lg bg-white`} // transition-colors duration-200 ${ isClickedZoomOut ? 'bg-gray-200' : 'bg-white' }
        onClick={() => deleteLastMarker()}>
          <Minus  className='h-[30px] w-[30px] text-[#888888]' />
        </button>
       
      </div>

      {/* 현재 총 거리 */}
      <div className="absolute flex items-center justify-center p-2 bg-white rounded-full border border-gray-200 shadow-lg bottom-20 left-3 z-10">
        <span className="text-xl font-bold text-[#232323]">1.96 <span className="text-base text-[#888888]">KM</span></span>
      </div>

  

      {/* {
  "course_name": "버스 런",
  "user_id": 1,
  "content" : "버스모양 코스입니다. 코스가 길어 숙련자에게 추천합니다.",
  "thumbnail_id" : "uuid000123",
  "created_at": "2024-08-22 15:33:53.157317",
  "updated_at": "2024-08-22 15:33:53.157317",
  "liked": 0,
  "distance": 34.123,
  "viewcount": 0,
  "waypoint": [{"La":126.57148654813169,"Ma":33.44908974922391},{"La":126.57156669275028,"Ma":33.450289156520846},{"La":126.57324468173204,"Ma":33.4502588789353},{"La":126.574075036090391},{"La":126.571566696,"Ma":33.44981093306277},{"La":126.57374621326552,"Ma":33.448872137126685},{"La":126.57179813467792,"Ma":33.44915393774874}],
  "city" : "가산",
  "is_private": true,
  "is_marathon" : false,
  "is_visible" : true,
  "center": [{"La":126.57179813467792,"Ma":33.44915393774874}],
  "level": 3,
  "url" : "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/seSzn5Nk0N2rORlkkrKe0N4wAKY",
  "is_primary" : true,
  "img_created_at" : "2024-08-22 15:33:53.157317"
} */}
      {/* 코스 등록 상세 페이지 */}
      <button className="absolute w-full flex items-center justify-center p-2 bottom-4 z-10"
      onClick={() => toggleMakeCoursePop()} >
        <div className="w-4/5 py-2 flex items-center justify-center bg-white rounded-full border border-gray-200 shadow-lg">
          <span className="text-xl font-bold text-[#232323]">코스 등록하기</span>
        </div>
      </button>

      <div className={`makeCoursePop flex flex-col bg-slate-600 text-lg z-50 ${toggleMakeCoursePop ? 'open' : ''}`} onSubmit={handlePostCourse} >
      <form className="flex flex-col gap-2 py-2" > 
        <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="course_name"
          placeholder="코스 이름을 입력"
          onChange={(e) =>
            setValues({ ...values, course_name: e.target.value })
          }
        />
        <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="content"
          placeholder="코스 설명"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
        />

        {/* 유저 명은 자동으로 입력 처리 */}
        {/* <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="user_id"
          placeholder="유저명도 입력"
          onChange={(e) => setValues({ ...values, user_id: e.target.value })}
        /> */}

        {/* 거리 계산 구현 후 자동 입력 처리 */}
        {/* <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="distance"
          placeholder="거리도 입력"
          onChange={(e) =>
            setValues({ ...values, distance: parseFloat(e.target.value) })
          }
        /> */}

        <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="city"
          placeholder="지역명 입력(ex.구로구)"
          onChange={(e) => setValues({ ...values, city: e.target.value })}
        />
        비밀글 여부 :
        <input
          className="border border-gray-400 rounded-md"
          type="checkbox"
          name="is_private"
          onChange={(e) =>
            setValues({ ...values, is_private: e.target.checked })
          }
        />
        <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="url"
          placeholder="이미지 URL"
          onChange={(e) => setValues({ ...values, url: e.target.value })}
        />
        <input
          className="border border-gray-400 bg-orange-300 rounded-md px-2 cursor-pointer"
          type="submit"
        ></input>
      </form>
      
      </div>


    </div>
  );
};

export default MakeCourse;
