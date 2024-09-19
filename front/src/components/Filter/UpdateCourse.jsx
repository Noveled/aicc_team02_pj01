import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ChevronLeft,
  PenLine,
  Plus,
  Minus,
  X,
  RotateCcw,
  UndoDot,
} from "lucide-react";

import "../../actions.css";
import { city_options } from "../../utils/data";
import { fetchUpdateCourse } from "../../redux/slices/apiSlice";

//
const { kakao } = window;

const UpdateCourse = () => {
  const location = useLocation();
  const course_info = location.state;
  // console.log('course_info', course_info);

  // useNavigate 훅 생성
  const navigate = useNavigate();
  // 유저 정보 불러오기
  const dispatch = useDispatch();
  // const [userData, setUserData] = useState();
  const userData = useSelector((state) => state.userInfoState);
  const ct_options = city_options;

  // 기본 업로드 이미지
  const defaultImgUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6HV-Q89MQyGPRXVkF-O4g9UGALROyOxwcRKoUFjaDTwS6hKsRZ3OqhkDBaYNa2ObR9E&usqp=CAU"; // 기본 이미지 URL
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
  const [isClickedClearAll, setIsClickedClearAll] = useState(false); // 마커 모두지우기 색상
  const [isClickedClearLast, setIsClickedClearLast] = useState(false); // 마커하나 지우기 색상

  // 이미지 업로드
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  const handleBack = () => window.history.back();

  const markerImages = {
    start: new kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
      new kakao.maps.Size(32, 34),
      { offset: new kakao.maps.Point(18, 32) }
    ),
    waypoint: new kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      new kakao.maps.Size(32, 34),
      { offset: new kakao.maps.Point(18, 32) }
    ),
  };

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    const kakaoMap = new kakao.maps.Map(mapContainer, {
      center: new kakao.maps.LatLng(
        course_info.center.Ma,
        course_info.center.La
      ),
      level: course_info.level,
    });
    setMap(kakaoMap);

    window.kakao.maps.event.addListener(kakaoMap, "click", (mouseEvent) => {
      const position = mouseEvent.latLng;
      addMarker(position);
      addLinePath(position);
      addDstance();
    });
  }, [course_info.center, course_info.level]);

  useEffect(() => {
    const loadMarkers = () => {
      clearAllMarkers();
      course_info.waypoint.forEach(({ Ma, La }, index) => {
        const position = new kakao.maps.LatLng(Ma, La);
        addMarker(position);
        addLinePath(position);
      });
    };

    if (map) {
      loadMarkers();
    }
  }, [map]); // map, course_info.waypoint, markerImages

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
      .post(`${process.env.REACT_APP_MY_DOMAIN}/upload_image`, formData)
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
    course_id: course_info.course_id,
    course_name: course_info.course_name || "",
    content: course_info.content || "",
    user_id: course_info.user_id || "",
    distance: course_info.distance || 0,
    waypoint: course_info.waypoint || linePath,
    city: course_info.city || "",
    is_private: course_info.is_private || false,
    url: course_info.img_url || "",
    center: course_info.center || "",
    level: course_info.level || "",
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

  // 로그인 여부 체크 겸 유저 id 미리 집어넣기
  useEffect(() => {
    if (userData.userInfo === null) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    setValues({ ...values, user_id: userData.userInfo.user_table_idx });
  }, []);

  useEffect(() => {
    // 스크롤 비활성화
    document.body.style.overflow = "hidden";

    const preventScroll = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("scroll", preventScroll);
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      // 컴포넌트 언마운트 시 스크롤 복원
      document.body.style.overflow = "";

      window.removeEventListener("scroll", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

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
  // useEffect(() => {
  //   const popHeader = document.querySelector(".makeCourseHeader");
  //   if (popHeader) {
  //     if (isMakeCoursePop) {
  //       popHeader.innerText = "설명을 추가해 코스를 완성하세요.";
  //     } else {
  //       popHeader.innerText = "지도를 눌러 코스를 그려주세요.";
  //     }
  //   }
  // }, [isMakeCoursePop]);

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

  // 마커 지우기 색상 전환
  useEffect(() => {
    if (isClickedClearAll) {
      const timer = setTimeout(() => {
        setIsClickedClearAll(false);
      }, 200); // 200ms 후에 원래 배경색으로 복원
      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [isClickedClearAll]);

  useEffect(() => {
    if (isClickedClearLast) {
      const timer = setTimeout(() => {
        setIsClickedClearLast(false);
      }, 200); // 200ms 후에 원래 배경색으로 복원
      return () => clearTimeout(timer); // 타이머 클리어
    }
  }, [isClickedClearLast]);

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
    setIsClickedClearAll(true);
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
    setIsClickedClearLast(true);
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
    // console.log("isMakeCoursePop Click :", isMakeCoursePop);
    setIsMakeCoursePop(!isMakeCoursePop);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    // console.log('userData.userInfo.user_table_idx', userData.userInfo.user_table_idx);
    console.log("values", values);

    e.preventDefault();

    if (!values.course_name || !values.content || !values.url) {
      alert("입력값을 확인해주세요.");
      return;
    }
    if (values.waypoint.length < 2) {
      toast.error("지도를 클릭해 코스를 입력해주세요.");
      return;
    }

    try {
      await dispatch(fetchUpdateCourse(values)).unwrap();
      toast.success("코스가 수정되었습니다.");
      // handleBack(); // 수정한 내용을 바로 반영 못하는 현상이 있음
      navigate("/box"); // 위 내용 수정하려면 backend endpoint 이용해야 할것으로 생각되어 우선 임시로 box 로 이동시킴.
      window.location.reload();
    } catch (error) {
      console.log("Error update course:", error);
      toast.error("코스 수정에 실패했습니다.");
    }
    // dispatch(fetchUpdateCourse(course_info.course_id));
  };

  // console.log(values);
  // console.log(markers);

  return (
    <div className="make-course relativ h-[100vh]">
      {/* 헤더 영역 */}
      <div className="absolute top-4 left-0 w-full flex justify-between items-center py-4 px-6 z-10">
        <button onClick={handleBack}>
          <ChevronLeft className="w-8 h-8 cursor-pointer" />
        </button>
        <div className="w-full flex justify-center">
          <div className="makeCourseHeader relative border rounded-3xl px-6 py-[6px] bg-[#7c5ecf] text-base text-white font-bold shadow-2xl">
            <div className="absolute border border-[#7c5ecf] flex gap-2 bg-white rounded-3xl p-1 -left-4 bottom-7 h-6 items-center">
              <PenLine className="text-[#7c5ecf] w-3 h-3" />
              <span className=" text-[#7c5ecf] px-1 mr-2 font-semibold text-[8px]">
                {isMakeCoursePop ? <span>STEP 2</span> : <span>STEP 1</span>}
              </span>
            </div>
            {isMakeCoursePop
              ? "설명을 추가해 코스를 완성하세요."
              : "지도를 눌러 코스를 그려주세요"}
          </div>
        </div>
      </div>

      {/* 카카오 맵 */}
      <div
        id="map"
        className="relative"
        style={{ width: "100%", height: "100%" }}
      ></div>

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

      {/* 버튼 */}
      <div className="absolute flex flex-col gap-1 bottom-[150px] right-3 z-10">
        {/* 마커 모두 지우기 */}
        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg transition-colors duration-200 ${
            isClickedClearAll ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => clearAllMarkers()}
        >
          <RotateCcw className="h-[30px] w-[30px] text-[#c8b5fc]" />
        </button>

        {/* 마커 하나 지우기 */}
        <button
          className={`border border-gray-200 rounded-full p-1 shadow-lg transition-colors duration-200 ${
            isClickedClearLast ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => deleteLastMarker()}
        >
          <UndoDot className="h-[30px] w-[30px] text-[#c8b5fc]" />
        </button>
      </div>

      {/* 현재 총 거리 */}
      <div className="absolute flex items-center justify-center p-2 bg-white rounded-full border border-gray-200 shadow-lg bottom-[150px] left-3 z-10">
        <span className="text-xl font-bold text-[#111111]">
          {calculateDist()}
          <span className="text-base text-[#7c5ecf]"> KM</span>
        </span>
      </div>

      {/* 코스 등록 상세 페이지 */}
      <button
        className="absolute w-full flex items-center justify-center p-2 bottom-[86px] z-10"
        onClick={() => toggleMakeCoursePop()}
      >
        <div className="w-4/5 py-2 flex items-center justify-center bg-white rounded-full border-2 border-[#7c5ecf] shadow-lg">
          <span className="text-xl  font-bold text-[#7c5ecf]">
            코스 정보 수정하기
          </span>
        </div>
      </button>

      <div
        className={`makeCoursePop flex flex-col items-center  bg-white text-lg z-50 border-t-2 border-[#7c5ecf] rounded-t-2xl overflow-auto`}
        onSubmit={handleUpdateCourse}
      >
        <div className="flex flex-col w-full h-full p-4 max-w-[390px]">
          <button
            className="flex justify-end"
            onClick={() => toggleMakeCoursePop()}
          >
            <X className="text-[#888888]" />
          </button>
          <form className="flex flex-col w-full h-full gap-2 text-[#111111]">
            <div className="flex flex-col">
              <span className="text-base font-semibold py-1">코스명</span>
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
            </div>

            {/* 이미지 업로드 */}
            <img
              className="w-full h-[240px] border border-gray-[#888888] rounded-md overflow-hidden object-cover"
              src={uploadImgUrl || defaultImgUrl}
              alt="Preview"
              img="img"
            />
            <input
              type="file"
              accept="image/*"
              onChange={onchangeImageUpload}
            />

            <div className="flex flex-col">
              <span className="text-base font-semibold py-1">코스 설명</span>
              <textarea
                className="border w-full h-[180px] border-gray-400 rounded-md resize-none"
                type="text"
                name="content"
                placeholder="코스 설명"
                value={values.content}
                onChange={(e) =>
                  setValues({ ...values, content: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <span className="text-base text-[#111111] font-semibold py-1">
                지역
              </span>
              <Select
                options={ct_options}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? "purple" : "#7c5ecf",
                  }),
                }}
                defaultInputValue={values.city}
                onChange={(e) => setValues({ ...values, city: e.value })}
              ></Select>
            </div>

            <div>
              <span className="text-base font-semibold py-1">비밀글 여부 </span>
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

            <input
              className="border border-none text-white py-1 bg-[#7c5ecf] rounded-md px-2 cursor-pointer"
              type="submit"
              value={"수정"}
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
