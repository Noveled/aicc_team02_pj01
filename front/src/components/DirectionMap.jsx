import React, { useState, useEffect } from 'react'

const { kakao } = window;

const DirectionMap = () => {
  const [map, setMap] = useState(null);
  const [pointObj, setPointObj] = useState({
    startPoint: {marker: null, lat: null, lng: null},
    endPoint: {marker: null, lat: null, lng: null}
  });

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    const mapOptions = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };

    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
    setMap(kakaoMap);
  }, []);

   // pointObj의 변경이 있을 때마다 출발지와 목적지의 marker를 map에 표시해줍니다.
   useEffect(() => {
    for (const point in pointObj) {
      if (pointObj[point].marker) {
        pointObj[point].marker.setMap(map);
      }
    }
  }, [pointObj]);

  function setCenter({lat, lng}) {
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
  }

  function setPoint({lat, lng}, pointType) {
    setCenter({lat, lng});
    let marker = new kakao.maps.Marker({position: new kakao.maps.LatLng(lat, lng)});
     setPointObj(prev => {
        if (pointObj[pointType].marker !== null) {
          // 주소가 변경되었을 때 기존 marker를 제거합니다.
           prev[pointType].marker.setMap(null);
        }
        return {...prev, [pointType]: {marker, lat, lng}};
     });
  }

  function panTo({lat, lng}) {
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
  }


  async function getCarDirection() {
    const REST_API_KEY = {
      apiKey: process.env.REACT_APP_MAP_REST_KEY,
    };
    console.log(REST_API_KEY);
    // 호출방식의 URL을 입력합니다.
    const url = 'https://apis-navi.kakaomobility.com/v1/directions';

   // 출발지(origin), 목적지(destination)의 좌표를 문자열로 변환합니다.
    const origin = `${pointObj.startPoint.lng},${pointObj.startPoint.lat}`; 
    const destination = `${pointObj.endPoint.lng},${pointObj.endPoint.lat}`;
    
    // 요청 헤더를 추가합니다.
    const headers = {
      Authorization: `KakaoAK ${REST_API_KEY.apiKey}`,
      'Content-Type': 'application/json'
    };
  
    // 표3의 요청 파라미터에 필수값을 적어줍니다.
    const queryParams = new URLSearchParams({
      origin: origin,
      destination: destination
    });
    
    const requestUrl = `${url}?${queryParams}`; // 파라미터까지 포함된 전체 URL

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const linePath = [];
      data.routes[0].sections[0].roads.forEach(router => {
        router.vertexes.forEach((vertex, index) => {
          // x,y 좌표가 우르르 들어옵니다. 그래서 인덱스가 짝수일 때만 linePath에 넣어봅시다.
          // 저도 실수한 것인데 lat이 y이고 lng이 x입니다.
          if (index % 2 === 0) {
            linePath.push(new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
          }
        });
      });
      var polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#000000',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
      }); 
      polyline.setMap(map);
      
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  
  
  return (
    <div>
      <h2>Direction Map</h2>
      <div id="map" style={{width: "800px", height: "800px"}}/>
      <div style={{display: "flex", gap: "10px", marginTop: "10px", marginLeft: "10px"}}>
          <button className='border border-gray-400 rounded-md p-1'
          onClick={() => setPoint({lat: 33.452613, lng: 126.570888}, 'startPoint')}>
             출발지1 지정
          </button>
          <button className='border border-gray-400 rounded-md p-1'
           onClick={() => setPoint({lat: 33.45058, lng: 126.574942}, 'endPoint')}>
             출발지2 지정
          </button>
          <button className='border border-gray-400 rounded-md p-1'
          onClick={() => getCarDirection()}>경로탐색</button>
       </div>
    </div>
  )
}

export default DirectionMap