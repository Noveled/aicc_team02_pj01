// ToDo
// 전체 거리 자동 계산
// 코스 등록시 유저ID 는 로그인 기준으로 자동 입력
//

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseData from './CourseData';

const { kakao } = window;

const PolyMap = () => {
  const positions = [
    { title: '카카오', latlng: new kakao.maps.LatLng(33.450705, 126.570677) },
    { title: '생태연못', latlng: new kakao.maps.LatLng(33.450936, 126.569477) },
    { title: '텃밭', latlng: new kakao.maps.LatLng(33.450879, 126.56994) },
    { title: '근린공원', latlng: new kakao.maps.LatLng(33.451393, 126.570738) },
  ];

  const imageSrc =
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

  const [map, setMap] = useState(null);
  const [mapCenter, SetMapCenter] = useState();
  const [mapLevel, SetMapLevel] = useState();
  const [markers, setMarkers] = useState([]);
  const [boxMarkers, setBoxMarkers] = useState([]);
  const [linePath, setLinePath] = useState([]);
  const [boxInfo, setBoxInfo] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [values, setValues] = useState({
    course_name: '',
    user_id: '',
    distance: '',
    waypoint: linePath,
    city: '',
    is_private: true,
    url: '',
    center: '',
    level: '',
  });

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

  // useEffect(() => {
  //   const mapCenter = map.getCenter();
  //   const lv = map.getLevel();
  //   SetMapCenter(mapCenter);
  //   SetMapLevel(lv);

  //   console.log(mapCenter, mapLevel);
  // }, [mapCenter, mapLevel]);

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

  const addLinePath = (position) => {
    const path = new kakao.maps.LatLng(position.Ma, position.La);
    setLinePath((prevPath) => [...prevPath, path]);
  };

  const addMarker = (position) => {
    const marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const createCustomOverlay = (position, title) => {
    const content = `
      <div class="customoverlay">
        <a href="https://map.kakao.com/link/map/11394059" target="_blank">
          <span class="title">${title}</span>
        </a>
      </div>`;

    return new kakao.maps.CustomOverlay({
      map,
      position,
      content,
      yAnchor: 1,
    });
  };

  const addBoxMarker = (data) => {
    const imageSize = new kakao.maps.Size(24, 35);
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    const marker = new kakao.maps.Marker({
      map,
      position: data.latlng,
      title: data.title,
      image: markerImage,
    });

    const customOverlay = createCustomOverlay(data.latlng, data.title);

    setBoxMarkers((prevMarkers) => [...prevMarkers, marker]);
    setBoxInfo((prevBoxInfo) => [...prevBoxInfo, customOverlay]);
  };

  const loadMarkers = (data, center, level) => {
    clearAllMarkers();
    data.forEach(({ Ma, La }) => {
      // for (let i = 0; i < LONG.length; i++) {
      // const position = new kakao.maps.LatLng(LONG[i], LAT[i]);
      const position = new kakao.maps.LatLng(Ma, La);
      addMarker(position);
      addLinePath(position);
    });
    // var moveLatLon = new kakao.maps.LatLng(center.La, center.Ma);
    // console.log('level', level);
    map.setLevel(level);
    panTo(center);
  };

  const clearAllMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    setLinePath([]);
  };

  const deleteLastMarker = () => {
    if (markers.length > 0) {
      const lastMarker = markers[markers.length - 1];
      lastMarker.setMap(null);

      setMarkers(markers.slice(0, -1));
      setLinePath(linePath.slice(0, -1));
    }
  };

  // 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
  const printMarkers = (map) => {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  const toggleBoxMarkers = (shouldDisplay) => {
    boxMarkers.forEach((marker) => marker.setMap(shouldDisplay ? map : null));
    boxInfo.forEach((info) => info.setMap(shouldDisplay ? map : null));
  };

  const loadBoxMarkers = () => {
    if (boxMarkers.length === 0) {
      positions.forEach((pos) => addBoxMarker(pos));
    }
    toggleBoxMarkers(true);
  };

  const deleteBoxMarkers = () => {
    toggleBoxMarkers(false);
    setBoxMarkers([]);
    setBoxInfo([]);
  };

  const getMapInfo = () => {
    SetMapCenter(map.getCenter());
    SetMapLevel(map.getLevel());
  };

  const panTo = (centerPos) => {
    // 이동할 위도 경도 위치를 생성합니다
    // var moveLatLon = new kakao.maps.LatLng(centerPos);
    var moveLatLon = new kakao.maps.LatLng(centerPos.Ma, centerPos.La);
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    // console.log('moveLatLon :', moveLatLon);
    map.panTo(moveLatLon);
  };

  const handleGetCourse = (e) => {
    e.preventDefault();

    axios
      .get('http://localhost:8080/get_course?isVisible=true')
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          // navigate('/login');
          // console.log(res.data);
          setCourseData(res.data);
        } else {
          alert('코스 불러오기 실패했습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePostCourse = (e) => {
    e.preventDefault();

    if (
      !values.course_name ||
      !values.user_id ||
      !values.distance ||
      !values.city ||
      !values.url
    ) {
      alert('입력값을 확인해주세요.');
      return;
    }
    if (values.waypoint.length === 0) {
      alert('지도를 클릭해 코스를 입력해주세요.');
      return;
    }

    axios
      .post('http://localhost:8080/make_course', values)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          console.log(res);
          alert('코스등록이 완료되었습니다.');
        } else {
          alert('코스등록에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log(courseData);
  // console.log(values);
  // console.log(markers);
  // console.log(linePath);
  // console.log(courseData);
  // console.log(mapCenter, mapLevel);
  return (
    <>
      <h2>Poly Map</h2>
      <div id="map" style={{ width: '800px', height: '800px' }}></div>

      <form className="flex gap-2 py-2" onSubmit={handlePostCourse}>
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
        <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="user_id"
          placeholder="유저명도 입력"
          onChange={(e) => setValues({ ...values, user_id: e.target.value })}
        />
        <input
          className="border border-gray-400 rounded-md"
          type="text"
          name="distance"
          placeholder="거리도 입력"
          onChange={(e) =>
            setValues({ ...values, distance: parseFloat(e.target.value) })
          }
        />
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

      <button
        className="border border-gray-400 rounded-md p-1"
        onClick={deleteLastMarker}
      >
        마커 하나 지우기
      </button>
      <button
        className="border border-gray-400 rounded-md p-1"
        onClick={clearAllMarkers}
      >
        마커 모두 지우기
      </button>
      <button
        className="border border-gray-400 rounded-md p-1"
        onClick={getMapInfo}
      >
        맵 정보 구하기
      </button>
      {/* <button className='border border-gray-400 rounded-md p-1'  */}
      {/* onClick={() => loadMarkers(courseData[4].waypoint)}>저장된 마커2 불러오기</button> */}
      <button
        className="border border-gray-400 rounded-md p-1"
        onClick={loadBoxMarkers}
      >
        물품보관함 불러오기
      </button>
      <button
        className="border border-gray-400 rounded-md p-1"
        onClick={deleteBoxMarkers}
      >
        물품보관함 지우기
      </button>
      <button
        className="border border-gray-400 rounded-md p-1"
        onClick={handleGetCourse}
      >
        코스 목록 불러오기
      </button>

      <h2 className="font-semibold text-xl">CourseData</h2>
      {courseData.map((data, idx) => (
        <CourseData key={idx} data={data} func={loadMarkers} />
      ))}
    </>
  );
};

export default PolyMap;
