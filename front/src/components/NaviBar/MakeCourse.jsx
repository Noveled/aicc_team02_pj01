import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeCurrentPage } from "../../redux/slices/currentStateSlice";
import { changeMapInfo } from "../../redux/slices/currentStateSlice";
import { toast } from "react-toastify";
import axios from "axios";

import { ChevronLeft, PenLine, Plus, Minus, X } from "lucide-react";

import "../../actions.css";

//
const { kakao } = window;

const MakeCourse = () => {
  // useNavigate 훅 생성
  const navigate = useNavigate();
  // 유저 정보 불러오기
  const dispatch = useDispatch();
  // const [userData, setUserData] = useState();
  const userData = useSelector((state) => state.userInfoState);
  const mapInfo = useSelector((state) => state.currentState.mapInfo);
  // console.log(mapInfo);

  // console.log('userData', userData);

  // 마커 이미지
  const startSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png";
  const imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
  const imageSize = new kakao.maps.Size(32, 34); // 마커이미지의 크기입니다
  const imageOption = { offset: new kakao.maps.Point(18, 32) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  const [map, setMap] = useState(null); // 지도 상태관리
  const [markers, setMarkers] = useState([]); // 마커
  const [linePath, setLinePath] = useState([]); // 폴리라인
  const [dists, setDists] = useState([]); // 거리 계산

  const [isMakeCoursePop, setIsMakeCoursePop] = useState(false); // 등록창 팝업 여부

  const [isClickedZoomIn, setIsClickedZoomIn] = useState(false); // 줌인 색상
  const [isClickedZoomOut, setIsClickedZoomOut] = useState(false); // 줌아웃 색상
  // 이미지 업로드
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  const onchangeImageUpload = (e) => {
    const { files } = e.target;
    const uploadFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onloadend = () => {
      console.log("reader.result", reader.result);
      setUploadImgUrl(reader.result);
    };

    // 서버용 이미지 처리
    const formData = new FormData();
    formData.append("file", uploadFile);
    // console.log('uploadFile', uploadFile);
    axios
      .post("http://localhost:8080/upload_image", formData)
      .then((res) => {
        setUploadImgUrl(res.data.url);
        setValues({ ...values, url: res.data.url });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  // 거리 랜덤 등록
  const getRandomNum = (min, max) => {
    let random_num = Math.random() * (max - min) + min;

    return Math.round(random_num * 100) / 100;
  };

  // 코스 등록시 필요한 값
  const [values, setValues] = useState({
    course_name: "",
    content: "",
    user_id: "",
    distance: 0,
    waypoint: linePath,
    city: "강동구",
    is_private: false,
    url: "",
    center: "",
    level: "",
  });

  // 마커, 폴리라인 추가
  const addDstance = () => {
    setDists((prevDist) => {
      let dist;
      if (prevDist.length === 0) {
        dist = 0;
      } else {
        dist = getRandomNum(0, 3);
      }
      return [...prevDist, dist];
    });
  };
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
        markerImage = new kakao.maps.MarkerImage(
          startSrc,
          imageSize,
          imageOption
        );
      } else {
        // console.log('중간마커');
        markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );
      }

      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        position: position,
        image: markerImage, // 마커이미지 설정
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
    // console.log(mapInfo.center['Ma'], mapInfo.center['La']);
    // console.log(mapInfo.lv);
    const mapContainer = document.getElementById("map");
    const mapOptions = {
      center: new kakao.maps.LatLng(mapInfo.center["Ma"], mapInfo.center["La"]),
      level: mapInfo.lv,
    };

    const kakaoMap = new kakao.maps.Map(mapContainer, mapOptions);
    setMap(kakaoMap);

    window.kakao.maps.event.addListener(kakaoMap, "click", (mouseEvent) => {
      const position = mouseEvent.latLng;
      addMarker(position);
      addLinePath(position);
      addDstance();
    });
  }, []);

  // 유저 id 미리 집어넣기
  useEffect(() => {
    setValues({ ...values, user_id: userData.userInfo.user_table_idx });
  }, []);

  useEffect(() => {
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

  // values의 waypoint, center, level 값 갱신 &
  // 맵 위에 마커, 폴리라인 그리기
  useEffect(() => {
    if (map !== null) {
      const center = map.getCenter();
      const lv = map.getLevel();
      setValues({
        ...values,
        waypoint: linePath,
        center: center,
        level: lv,
        distance: calculateDist(),
      });
    }

    if (map && linePath.length > 0) {
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FFAE00",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      polyline.setMap(map);
      printMarkers(map);

      return () => polyline.setMap(null);
    }
  }, [linePath, map]);

  // 코스 등록 상세페이지 팝업을 위한 상태관리
  useEffect(() => {
    const popHeader = document.querySelector(".makeCourseHeader");
    if (popHeader) {
      if (isMakeCoursePop) {
        popHeader.innerText = "설명을 추가해 코스를 완성하세요.";
      } else {
        popHeader.innerText = "지도를 눌러 코스를 그려주세요.";
      }
    }
  }, [isMakeCoursePop]);

  // 줌 인 아웃 색상전환
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
    const popElement = document.querySelector(".makeCoursePop");
    if (popElement) {
      if (isMakeCoursePop) {
        popElement.classList.add("open");
      } else {
        popElement.classList.remove("open");
      }
    }
  }, [isMakeCoursePop]);

  // 버튼 기능 구현 파트

  // 모든 마커 지우기
  const clearAllMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    setLinePath([]);
    setDists([]);
  };

  // 마지막에 추가된 마커 지우기
  const deleteLastMarker = () => {
    if (markers.length > 0) {
      const lastMarker = markers[markers.length - 1];
      lastMarker.setMap(null);

      setMarkers(markers.slice(0, -1));
      setLinePath(linePath.slice(0, -1));
      setDists(dists.slice(0, -1));
    }
  };

  // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수
  const zoomIn = () => {
    map.setLevel(map.getLevel() - 1);
    setIsClickedZoomIn(true);
  };

  // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수
  const zoomOut = () => {
    map.setLevel(map.getLevel() + 1);
    setIsClickedZoomOut(true);
  };

  const calculateDist = () => {
    let total = dists.reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    return Math.round(total * 100) / 100;
  };

  const toggleMakeCoursePop = () => {
    console.log("isMakeCoursePop Click :", isMakeCoursePop);
    setIsMakeCoursePop(!isMakeCoursePop);
  };
  const handlePostCourse = (e) => {
    e.preventDefault();
    // console.log('userData.userInfo.user_table_idx', userData.userInfo.user_table_idx);
    console.log("values", values);

    e.preventDefault();

    if (!values.course_name || !values.content || !values.url) {
      toast.error("입력값을 확인해주세요.");
      return;
    }
    if (values.waypoint.length < 2) {
      toast.error("지도를 클릭해 코스를 입력해주세요.");
      return;
    }

    axios
      .post("http://localhost:8080/make_course", values)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          console.log(res);

          // 값 초기화
          setValues({
            course_name: "",
            content: "",
            user_id: "",
            distance: "",
            waypoint: linePath,
            city: "강동구",
            is_private: false,
            url: "",
            center: "",
            level: "",
          });

          // 마커도 초기화
          clearAllMarkers();

          toast.success("코스등록이 완료되었습니다.");
          // 페이지 이동
          navigate("/box");
        } else {
          toast.error("코스등록에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(values);

  return (
    <div className="make-course relative">
      {/* 헤더 영역 */}
      <div className="absolute top-4 left-0 w-full flex justify-between items-center py-4 px-6 z-10">
        <Link
          to={"/main"}
          onClick={() => dispatch(changeCurrentPage({ title: "주변" }))}
        >
          <ChevronLeft className="w-8 h-8 cursor-pointer" />
        </Link>
        <div className="relative w-full">
          <div className="absolute flex gap-2 bg-sky-500 rounded-3xl p-1 -left-2 bottom-6">
            <PenLine className="text-white w-3 h-3" />
            <span className=" text-white font-semibold text-[8px]">
              {isMakeCoursePop ? <span>STEP 2</span> : <span>STEP 1</span>}
            </span>
          </div>
          <span className="makeCourseHeader border rounded-3xl px-4 py-[6px] bg-slate-600 text-base text-white font-bold"></span>
        </div>
      </div>
      {/* 카카오 맵 */}
      <div
        id="map"
        className="relative"
        style={{ width: "400px", height: "900px" }}
      ></div>

      {/* 줌 인아웃 */}
      <div className="absolute flex flex-col gap-1 top-20 right-3 z-10">
        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg transition-colors duration-200 ${
            isClickedZoomIn ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => zoomIn()}
        >
          <Plus className="h-[22px] w-[22px] text-[#888888]" />
        </button>

        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg transition-colors duration-200 ${
            isClickedZoomOut ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => zoomOut()}
        >
          <Minus className="h-[22px] w-[22px] text-[#888888]" />
        </button>
      </div>

      {/* 버튼 */}
      <div className="absolute flex flex-col gap-1 bottom-[150px] right-3 z-10">
        {/* 마커 모두 지우기 */}
        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg bg-white`} // transition-colors duration-200 ${ isClickedZoomOut ? 'bg-gray-200' : 'bg-white' }
          onClick={() => clearAllMarkers()}
        >
          <Minus className="h-[30px] w-[30px] text-[#888888]" />
        </button>

        {/* 마커 하나 지우기 */}
        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg bg-white`} // transition-colors duration-200 ${ isClickedZoomOut ? 'bg-gray-200' : 'bg-white' }
          onClick={() => deleteLastMarker()}
        >
          <Minus className="h-[30px] w-[30px] text-[#888888]" />
        </button>
      </div>

      {/* 현재 총 거리 */}
      <div className="absolute flex items-center justify-center p-2 bg-white rounded-full border border-gray-200 shadow-lg bottom-[150px] left-3 z-10">
        <span className="text-xl font-bold text-[#232323]">
          {calculateDist()}
          <span className="text-base text-[#888888]">KM</span>
        </span>
      </div>

      {/* 코스 등록 상세 페이지 */}
      <button
        className="absolute w-full flex items-center justify-center p-2 bottom-[86px] z-10"
        onClick={() => toggleMakeCoursePop()}
      >
        <div className="w-4/5 py-2 flex items-center justify-center bg-white rounded-full border border-gray-200 shadow-lg">
          <span className="text-xl font-bold text-[#232323]">
            코스 등록하기
          </span>
        </div>
      </button>

      <div
        className={`makeCoursePop flex flex-col bg-slate-600 text-lg z-50`}
        onSubmit={handlePostCourse}
      >
        <div className="flex flex-col p-4 ">
          <button
            className="flex justify-end"
            onClick={() => toggleMakeCoursePop()}
          >
            <X />
          </button>
          <form className="flex flex-col gap-2 py-2 text-black">
            <input
              className="border border-gray-400 rounded-md"
              type="text"
              name="course_name"
              placeholder="코스 이름을 입력"
              value={values.course_name}
              onChange={(e) =>
                setValues({ ...values, course_name: e.target.value })
              }
            />

            {/* 이미지 업로드 */}
            <img
              className="w-full max-h-[440px] object-cover"
              src={uploadImgUrl}
              alt="Preview"
              img="img"
            />
            <input
              type="file"
              accept="image/*"
              onChange={onchangeImageUpload}
            />

            <textarea
              className="border border-gray-400 rounded-md"
              type="text"
              name="content"
              placeholder="코스 설명"
              value={values.content}
              onChange={(e) =>
                setValues({ ...values, content: e.target.value })
              }
            />

            <div className="city">
              <label htmlFor="city">
                <span>지역</span>
              </label>
              <select
                name="city"
                id="city"
                className="form-control"
                value={values.city}
                onChange={(e) => setValues({ ...values, city: e.target.value })}
              >
                <option value="강남구">강남구</option>
                <option value="강동구">강동구</option>
                <option value="강북구">강북구</option>
                <option value="강서구">강서구</option>
                <option value="관악구">관악구</option>
                <option value="광진구">광진구</option>
                <option value="구로구">구로구</option>
                <option value="금천구">금천구</option>
                <option value="노원구">노원구</option>
                <option value="도봉구">도봉구</option>
                <option value="동대문구">동대문구</option>
                <option value="동작구">동작구</option>
                <option value="마포구">마포구</option>
                <option value="서대문구">서대문구</option>
                <option value="서초구">서초구</option>
                <option value="성동구">성동구</option>
                <option value="성북구">성북구</option>
                <option value="송파구">송파구</option>
                <option value="양천구">양천구</option>
                <option value="영등포구">영등포구</option>
                <option value="용산구">용산구</option>
                <option value="은평구">은평구</option>
                <option value="종로구">종로구</option>
                <option value="중구">중구</option>
                <option value="중랑구">중랑구</option>
              </select>
            </div>

            <div>
              <span>비밀글 여부 </span>
              <input
                className="border border-gray-400 rounded-md"
                type="checkbox"
                name="is_private"
                checked={values.is_private}
                onChange={(e) =>
                  setValues({ ...values, is_private: e.target.checked })
                }
              />
            </div>
            {/* <input
            className="border border-gray-400 rounded-md"
            type="text"
            name="url"
            placeholder="이미지 URL"
            value={values.url}
            onChange={(e) => setValues({ ...values, url: e.target.value })}
          /> */}
          
          
          <input
            className="border border-gray-400 bg-orange-300 rounded-md px-2 cursor-pointer"
            type="submit"
          ></input>
        </form>
      </div>
      </div>
    </div>
  );
};

export default MakeCourse;
