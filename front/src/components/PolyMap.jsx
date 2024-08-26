import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseData from './CourseData';

const { kakao } = window;

const PolyMap = () => {
  // const savedData1_Lat = [126.57140148443642, 126.57140946766687, 126.57311957214307, 126.57315464306784, 126.57188544093027, 126.57194497730383, 126.57280567702071];
  // const savedData1_Long = [33.453263870405465, 33.45164101554339, 33.451646914842485, 33.453269918180794, 33.45327455837337, 33.45210268216419, 33.45205155445761];

  // const savedData2_Lat = [ 126.57140148443642, 126.57140946766687, 126.57280567702071];
  // const savedData2_Long = [33.453263870405465, 33.45164101554339, 33.45205155445761];

  // const savedData1 = useState();

  // 물품 보관함 데이터 저장 형식
  const positions = [
    { title: '카카오', latlng: new kakao.maps.LatLng(33.450705, 126.570677) },
    { title: '생태연못', latlng: new kakao.maps.LatLng(33.450936, 126.569477) },
    { title: '텃밭', latlng: new kakao.maps.LatLng(33.450879, 126.569940) },
    { title: '근린공원', latlng: new kakao.maps.LatLng(33.451393, 126.570738) },
  ];

  // 물품 보관함 마커에 사용할 이미지
  const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

  // 상태 관리용 변수
  const [map, setMap] = useState(null); // map api 
  const [markers, setMarkers] = useState([]); // marker 
  const [boxMarkers, setBoxMarkers] = useState([]); // 물품보관함
  const [boxInfo, setBoxInfo] = useState([]); // 물품 보관함 
  const [linePath, setLinePath] = useState([]); // polyLine : 화면상에 경로 그려지는 선
  const [courseData, setCourseData] = useState([]); // 코스 데이터 
  const [values, setValues] = useState({
    course_name: '',
    user_id: '',
    distance: '',
    waypoint: '',
  }); // 코스 데이터

  // 처음 실행 시 kakao map api 불러오기
  // 유저 위치 정보 받아서 화면 센터로 지정될 수있도록 수정이 필요함.
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

  // 유저가 맵에 마커를 찍는 액션을 수행하는 경우 실행
  // polyline 과 marker 를 화면에 갱신
  useEffect(() => {
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

  // polyLine 그리기에 사용할 위,경도 좌표 추가
  const addLinePath = (position) => {
    const path = new kakao.maps.LatLng(position.Ma, position.La);
    setLinePath((prevPath) => [...prevPath, path]);
  };

  // marker 그리기에 사용할 위,경도 좌표 추가
  const addMarker = (position) => {
    const marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  // 마커 꾸미기
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

  // 물품 보관함 마커 꾸미고 저장하기
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

  // const loadMarkers = (LONG, LAT) => {
  //   clearAllMarkers();
  //   // data.forEach(({ Ma, La }) => {
  //   for (let i = 0; i < LONG.length; i++) {
  //     const position = new kakao.maps.LatLng(LONG[i], LAT[i]);
  //     addMarker(position);
  //     addLinePath(position);
  //   };
  // };


  // 모든 marker, polyLine 상태 초기화 및 화면에서 지우기
  const clearAllMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    setLinePath([]);
  };

  // 마지막 marker, polyLine 지우기
  const deleteLastMarker = () => {
    if (markers.length > 0) {
      const lastMarker = markers[markers.length - 1];
      lastMarker.setMap(null);

      setMarkers(markers.slice(0, -1));
      setLinePath(linePath.slice(0, -1));
    }
  };

   // 배열에 추가된 마커들을 지도에 표시하거나 제거
  const printMarkers = (map) => {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }            
  }

  const toggleBoxMarkers = (shouldDisplay) => {
    boxMarkers.forEach(marker => marker.setMap(shouldDisplay ? map : null));
    boxInfo.forEach(info => info.setMap(shouldDisplay ? map : null));
  };

  // 물품 보관함 마커 보이기
  const loadBoxMarkers = () => {
    if (boxMarkers.length === 0) {
      positions.forEach(pos => addBoxMarker(pos));
    }
    toggleBoxMarkers(true);
  };

  // 물품 보관함 마커 지우기
  const deleteBoxMarkers = () => {
    toggleBoxMarkers(false);
    setBoxMarkers([]);
    setBoxInfo([]);
  };

  const handleGetCourse = (e) => {
    e.preventDefault();
    
    axios.get('http://localhost:8082/get_course')
    .then((res) => {
      // console.log(res);
      if (res.status === 200) {
        // navigate('/login');
        // console.log(res.data);
        setCourseData(res.data)
      } else {
        alert('코스 불러오기 실패했습니다.');
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  const handlePostCourse = (e) => {
    e.preventDefault();
    
    if(!values.course_name || !values.user_id || !values.distance) {
      alert('입력값을 확인해주세요.');
      return;
    }

    axios.post('http://localhost:8082/post_course', values)
    .then((res) => {
      console.log(res);
      if (res.status === 201) {
        console.log(res);
        alert('코스등록이 완료되었습니다.');
      } else {
        alert('코스등록에 실패했습니다.');
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  // console.log(courseData);
  // console.log(values);
  // console.log(markers);
  console.log(linePath);
  return (
    <>
      <h2>Poly Map</h2>
      <div id="map" style={{ width: "800px", height: "800px" }}></div>
      
      <form className='flex gap-2 py-2' onSubmit={handlePostCourse}>
        <input className='border border-gray-400 rounded-md' 
        type="text" name="course_name" placeholder='코스 이름을 입력'
        onChange={(e) => setValues({ ...values, course_name: e.target.value })} />
        <input className='border border-gray-400 rounded-md' 
        type="text" name="user_id" placeholder='유저명도 입력' 
        onChange={(e) => setValues({ ...values, user_id: e.target.value })} />
        <input className='border border-gray-400 rounded-md' 
        type="text" name="distance" placeholder='거리도 입력' 
        onChange={(e) => setValues({ ...values, distance: e.target.value })} />
        <input className='border border-gray-400 bg-orange-300 rounded-md px-2 cursor-pointer' 
        type='submit'></input>
      </form>

      <button className='border border-gray-400 rounded-md p-1' 
      onClick={deleteLastMarker}>마커 하나 지우기</button>
      <button className='border border-gray-400 rounded-md p-1' 
      onClick={clearAllMarkers}>마커 모두 지우기</button>
      {/* <button className='border border-gray-400 rounded-md p-1' 
      onClick={() => loadMarkers(savedData1_Long, savedData1_Lat)}>저장된 마커1 불러오기</button>
      <button className='border border-gray-400 rounded-md p-1' 
      onClick={() => loadMarkers(savedData2_Long, savedData2_Lat)}>저장된 마커2 불러오기</button> */}
      <button className='border border-gray-400 rounded-md p-1' 
      onClick={loadBoxMarkers}>물품보관함 불러오기</button>
      <button className='border border-gray-400 rounded-md p-1' 
      onClick={deleteBoxMarkers}>물품보관함 지우기</button>
      <button className='border border-gray-400 rounded-md p-1' 
      onClick={handleGetCourse}>코스 목록 불러오기</button>

      <h2 className='font-semibold text-xl'>CourseData</h2>
      {
        courseData.map((data) => (
          <CourseData data={data}/>
        ))
      }
    </>
  );
};

export default PolyMap;
