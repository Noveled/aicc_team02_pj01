import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { fetchGetCourseData, fetchStorageData, fetchWaterData, fetchBusStopData, } from '../redux/slices/apiSlice';


const { kakao } = window;

const MapBase = () => {
  const [map, setMap] = useState(null);
  const [infoOverlay, setInfoOverlay] = useState([]);
  // 각 마커가 표시될 좌표 배열

  const [type, setType] = useState('all'); 

  let markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png';  // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
  const [busstopMarkers, setBusstopMarkers] = useState([]);
  const [waterMarkers, setWaterMarkers] = useState([]);
  const [storageMarkers, setStorageMarkers] = useState([]);
  const [firstPointMarkers, setFirstPointMarkers] = useState([]);

  
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

  // console.log(stateCourseData);
  // console.log(stateStorageData);

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    const mapOptions = {
      center: new kakao.maps.LatLng(37.498004414546934, 127.02770621963765), // 지도의 중심좌표 
      level: 3 // 지도의 확대 레벨 
    };

    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
    setMap(kakaoMap);
  }, []);

  // useEffect(() => {
  //   if (busstopMarkers.length > 0) {
  //     getMarkers();
  //   }
  // }, [busstopMarkers])

  useEffect(() => {
    // 버스정류장 카테고리가 클릭됐을 때
    if (type === 'busstop') {  
      // 버스정류장 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(map);
      printWaterMarkers(null);
      printStorageMarkers(null);
      printFirstPointMarkers(null);
      console.log('버스정류장 마커들만 지도에 표시하도록 설정합니다');
    } else if (type === 'water') { // 공원음수대 카테고리가 클릭됐을 때
      // 공원음수대 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(null);
      printWaterMarkers(map);
      printStorageMarkers(null);
      printFirstPointMarkers(null);
      console.log('공원음수대 마커들만 지도에 표시하도록 설정합니다');
    } else if (type === 'storage') { // 물품보관함 카테고리가 클릭됐을 때
      // 물품보관함 마커들만 지도에 표시하도록 설정합니다
      printBusstopMarkers(null);
      printWaterMarkers(null);
      printStorageMarkers(map);
      printFirstPointMarkers(null);
      console.log('물품보관함 마커들만 지도에 표시하도록 설정합니다');
    } else if (type === 'point') {
      printBusstopMarkers(null);
      printWaterMarkers(null);
      printStorageMarkers(null);  
      printFirstPointMarkers(map);  
      console.log('출발지 마커들만 지도에 표시하도록 설정합니다');
    }
  }, [type])

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
  }

  // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
  const createMarker = (fac_data, image) => {
    // console.log(fac_data);
    let marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(fac_data['latitude'], fac_data['longitude']),
        image: image
    });

    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다 
    const content = document.createElement('div');
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
      position: marker.getPosition()       
    });

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, 'click', function() {
      overlay.setMap(map);
    });

    overlay.setMap(null);  // 기본은 닫고 시작

    // 닫기 버튼 이벤트 추가
  const closeBtn = content.querySelector('.close');
    closeBtn.addEventListener('click', function() {
      overlay.setMap(null);
    });
    
    return marker;  
  }   



  // 출발지 마커 생성
  // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
  const createFirstPointMarker = (course_data, image) => {
    const first_LatLng = course_data['waypoint'][0];
    console.log(first_LatLng['Ma'], first_LatLng['La']);
    
    let marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(first_LatLng['Ma'], first_LatLng['La']),
        image: image
    });

    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다 
    const content = document.createElement('div');
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
      position: marker.getPosition()       
    });

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, 'click', function() {
      overlay.setMap(map);
    });

    overlay.setMap(null);  // 기본은 닫고 시작

    // 닫기 버튼 이벤트 추가
  const closeBtn = content.querySelector('.close');
    closeBtn.addEventListener('click', function() {
      overlay.setMap(null);
    });
    
    return marker;  
  }   


  // 버스정류장 마커를 생성하고 버스정류장 마커 배열에 추가하는 함수입니다
  const createBusstopMarkers = () => {
    setBusstopMarkers([]);
    for (let i = 0; i < stateBusStopData.length; i++) {  
      let imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {  
                spriteOrigin: new kakao.maps.Point(10, 0),    
                spriteSize: new kakao.maps.Size(36, 98)  
            };     
        // 마커이미지와 마커를 생성합니다
        let markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createMarker(stateBusStopData[i], markerImage);  
        // 생성된 마커를 버스정류장 마커 배열에 추가합니다
        setBusstopMarkers((prev) => [...prev, marker]);
    }     
  }

  // 버스정류장 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printBusstopMarkers = (map) => {        
    for (let i = 0; i < busstopMarkers.length; i++) {  
      busstopMarkers[i].setMap(map);
    }        
  }

  // 공원음수대 마커를 생성하고 공원음수대 마커 배열에 추가하는 함수입니다
  const createWaterMarkers = () => {
    setWaterMarkers([]);
    for (let i = 0; i < stateWaterData.length; i++) {
        
      let imageSize = new kakao.maps.Size(22, 26),
        imageOptions = {   
            spriteOrigin: new kakao.maps.Point(10, 36),    
            spriteSize: new kakao.maps.Size(36, 98)  
        };       
    
        // 마커이미지와 마커를 생성합니다
        let markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createMarker(stateWaterData[i], markerImage);  
        // 생성된 마커를 공원음수대 마커 배열에 추가합니다
        setWaterMarkers((prev) => [...prev, marker]);
    }        
  }

  // 공원음수대 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printWaterMarkers = (map) => {        
    for (let i = 0; i < waterMarkers.length; i++) {  
      waterMarkers[i].setMap(map);
    }        
  }

  // 물품보관함 마커를 생성하고 물품보관함 마커 배열에 추가하는 함수입니다
  const createStorageMarkers = () => {
    setStorageMarkers([]);
    for (let i = 0; i < stateStorageData.length; i++) {
        
      let imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(10, 72),    
                spriteSize: new kakao.maps.Size(36, 98)  
            };       
    
        // 마커이미지와 마커를 생성합니다
        let markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createMarker(stateStorageData[i], markerImage);  

        // 생성된 마커를 물품보관함 마커 배열에 추가합니다
        setStorageMarkers((prev) => [...prev, marker]);
    }                
  }

  // 물품보관함 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printStorageMarkers = (map) => {        
    for (let i = 0; i < storageMarkers.length; i++) {  
      storageMarkers[i].setMap(map);
    }        
  }


  // 출발지 마커를 생성하고 물품보관함 마커 배열에 추가하는 함수입니다
  const createFirstPointMarkers = () => {
    setFirstPointMarkers([]);
    for (let i = 0; i < stateCourseData.length; i++) {
        
      let imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {   
                spriteOrigin: new kakao.maps.Point(10, 72),    
                spriteSize: new kakao.maps.Size(36, 98)  
            };       
    
        // 마커이미지와 마커를 생성합니다
        let markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),    
            marker = createFirstPointMarker(stateCourseData[i], markerImage);  

        // 생성된 마커를 물품보관함 마커 배열에 추가합니다
        setFirstPointMarkers((prev) => [...prev, marker]);
    }                
  }

  // 출발지 마커들의 지도 표시 여부를 설정하는 함수입니다
  const printFirstPointMarkers = (map) => {        
    console.log("출발지 마커 표시 중...", firstPointMarkers);
    for (let i = 0; i < firstPointMarkers.length; i++) {  
      firstPointMarkers[i].setMap(map);
    }        
  }

  const handleOnClickBtn = (type) => {
    setType(type)
  }

  // console.log(stateStorageData);
  // console.log(busstopMarkers);
  // console.log(firstPointMarkers);

  return (
    <div>
      <h2>Facilities Map</h2>
      <div id="map" className='relative' style={{width: "800px", height: "800px"}}/>
      <div className="bg-slate-100" style={{position: "absolute", display: "flex", gap: "10px", top: "20px", left: "10px", marginTop: "10px", marginLeft: "10px", zIndex: 1}}>
          <button className='border border-gray-400 rounded-md p-1'
          onClick={getMarkers}>
            주변 검색하기
          </button>
          
          <button className='border border-gray-400 rounded-md p-1'
          onClick={() => handleOnClickBtn('busstop')}>
            버스정류장
          </button>
          <button className='border border-gray-400 rounded-md p-1'
          onClick={() => handleOnClickBtn('water')}>
            공원음수대
          </button>
          <button className='border border-gray-400 rounded-md p-1'
          onClick={() => handleOnClickBtn('storage')}>
            물품보관함
          </button>

          <button className='border border-gray-400 rounded-md p-1'
          onClick={() => handleOnClickBtn('point')}>
            출발지
          </button>


       </div>
    </div>
  )
}

export default MapBase