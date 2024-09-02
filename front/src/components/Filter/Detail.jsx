import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { GiDiamonds } from "react-icons/gi";
import { toast } from "react-toastify";

import { fetchDeleteCourse, fetchUpdateViewcount } from "../../redux/slices/apiSlice";

const { kakao } = window;

const Detail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [linePath, setLinePath] = useState([]);

  const detail = location.state.item;
  const user = useSelector((state) => state.userInfoState.userInfo);
  const isUserOwner = user.user_id === detail.user_id;

  const viewData = {
  // console.log(user.user_id, detail.course_id);
    user_id: user.user_id,
    course_id: detail.course_id,
  };

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
      center: new kakao.maps.LatLng(detail.center.Ma, detail.center.La),
      level: detail.level,
    });
    setMap(kakaoMap);
  }, [detail.center, detail.level]);

  useEffect(() => {
    const loadMarkers = () => {
      clearMarkers();
      detail.waypoint.forEach(({ Ma, La }, index) => {
        const position = new kakao.maps.LatLng(Ma, La);
        addMarker(position, index === 0 ? markerImages.start : markerImages.waypoint);
        addLinePath(position);
      });
    };

    if (map) {
      loadMarkers();
    }
  }, [map]); // map, detail.waypoint, markerImages

  useEffect(() => {
    if (map && linePath.length > 0) {
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FFAE00",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      polyline.setMap(map);
      return () => polyline.setMap(null);
    }
  }, [map, linePath]);

  useEffect(() => {
    dispatch(fetchUpdateViewcount(viewData));
  }, [dispatch, viewData]);

  useEffect(() => {
    const preventScroll = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("scroll", preventScroll);
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("scroll", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const addMarker = (position, image) => {
    const marker = new kakao.maps.Marker({
      position,
      image,
    });
    marker.setMap(map);
    setMarkers((prev) => [...prev, marker]);
  };

  const addLinePath = (position) => {
    setLinePath((prev) => [...prev, position]);
  };

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    setLinePath([]);
  };

  const handleDelete = async () => {
    if (window.confirm("아이템을 삭제하시겠습니까?")) {
      try {
        await dispatch(fetchDeleteCourse(detail.course_id)).unwrap();
        toast.success("아이템이 삭제되었습니다.");
        navigate("/box");
      } catch (error) {
        toast.error("아이템 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  const handleBack = () => window.history.back();

  return (
    <div className="detail relative overflow-hidden">
      <div id="map" className="relative" style={{ width: "400px", height: "500px" }} />

      <div className="detail-wrapper">
        <div className="fixed top-0 left-0 w-full h-auto z-10">
          <div className="detail-header">
            <button onClick={handleBack} className="fixed left-[1rem] top-[0.25rem]">
              <ChevronLeft className="w-[2.5rem] h-[2.5rem] cursor-pointer items-center" />
            </button>
            <div className="text-xl">코스 상세페이지</div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-[#eee] pt-3 px-3 pb-8 text-gray-800 rounded-t-xl shadow-[0_-1px_6px_5px_rgba(0,0,0,0.2)] overflow-y-scroll z-10">
          <div className="flex flex-col gap-4 justify-between h-full text-base">
            <div className="flex flex-col justify-between">
              <h5 className="font-bold p-4">제목: {detail.course_name}</h5>
              <hr className="bg-purple-600 h-[2px]" />
            </div>

            <div className="flex flex-col gap-y-1 text-sm">
              <div className="flex items-center gap-x-2">
                <GiDiamonds className="w-4 h-4 text-yellow-500" />
                작성자: {detail.user_name}
              </div>
              <div className="flex items-center gap-x-2">
                <GiDiamonds className="w-4 h-4 text-yellow-500" />
                조회수: {detail.viewcount}
              </div>
              <div className="flex items-center gap-x-2">
                <GiDiamonds className="w-4 h-4 text-yellow-500" />
                거리: {detail.distance}km
              </div>
              <div className="flex items-center gap-x-2">
                <GiDiamonds className="w-4 h-4 text-yellow-500" />
                지역구: {detail.city}
              </div>
            </div>

            <div className="h-[50vh]">
              <img
                src={detail.img_url}
                alt="코스 이미지"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-[40%] p-3 bg-purple-200 rounded-md overflow-y-scroll text-gray-700 break-words">
              <p className="indent-4">{detail.content}</p>
            </div>

            {isUserOwner ? (
              <div className="flex justify-between gap-x-4 font-semibold">
                <button
                  onClick={() => {}}
                  className="w-full bg-yellow-300 py-2 rounded-xl hover:bg-yellow-400 hover:shadow-md"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-300 py-2 rounded-xl hover:bg-red-400 hover:shadow-md"
                >
                  삭제
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleBack}
                  className="w-full bg-purple-400 py-2 rounded-xl hover:bg-purple-500 hover:shadow-md"
                >
                  완료
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
