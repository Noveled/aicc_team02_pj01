import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { GiDiamonds } from "react-icons/gi";
import { toast } from "react-toastify";

import {
  fetchDeleteCourse,
  fetchGet1courseData,
  fetchUpdateViewcount,
} from "../../redux/slices/apiSlice";

const { kakao } = window;

const Detail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const detail = location.state.item;
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [linePath, setLinePath] = useState([]);

  const user = useSelector((state) => state.userInfoState.userInfo);
  const isUserOwner = user.user_id === detail.user_id;

  const viewData = {
    user_id: user.user_id,
    course_id: detail.course_id,
  };

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(viewData),
  };

  useEffect(() => {
    dispatch(fetchUpdateViewcount(options));
    // dispatch(fetchGet1courseData(detail.course_id));
  }, [dispatch, viewData]);

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
        addMarker(
          position,
          index === 0 ? markerImages.start : markerImages.waypoint
        );
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
        window.location.reload();
      } catch (error) {
        toast.error("아이템 삭제에 실패했습니다.");
        console.error(error);
      }
    }
  };

  const handleBack = () => {
    window.history.back();
    setTimeout(function () {
      window.location.reload();
    }, 50);
  };

  return (
    <div className="detail relative overflow-hidden">
      <div
        id="map"
        className="relative top-[48px]"
        style={{ width: "100%", height: "500px" }}
      />

      <div className="detail-wrapper">
        <div className="fixed top-0 left-0 w-full h-[48px] z-10">
          <div className="detail-header">
            <button onClick={handleBack} className="fixed left-[1rem]">
              <ChevronLeft className="w-[2.5rem] h-[2.5rem]" />
            </button>
            <div className="text-xl text-[#7c5ecf] font-bold">
              코스 상세페이지
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-white pt-3 px-3 pb-8 text-gray-800 rounded-t-xl shadow-[0_-1px_6px_5px_rgba(0,0,0,0.2)] z-10">
          <div className=" flex flex-col gap-4 h-full text-base">
            <div className=" flex flex-col justify-between w-full">
              <h5 className="text-[#111111] font-bold p-4">
                제목: {detail.course_name}
              </h5>
              <hr className="bg-[#7c5ecf] h-[2px]" />
            </div>

            <div className="overflow-y-scroll pb-12">
              <div className="grid grid-cols-2 gap-x-2 pb-4">
                <div className="flex flex-col justify-between text-sm h-[183px]">
                  <div className="flex items-center gap-x-2">
                    <GiDiamonds className="w-4 h-4 text-yellow-500" />
                    <span className="text-[#888888]">
                      작성자: {detail.user_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <GiDiamonds className="w-4 h-4 text-yellow-500" />
                    <span className="text-[#888888]">
                      조회수: {detail.viewcount}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <GiDiamonds className="w-4 h-4 text-yellow-500" />
                    <span className="text-[#888888]">
                      거리: {detail.distance}km
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <GiDiamonds className="w-4 h-4 text-yellow-500" />
                    <span className="text-[#888888]">
                      지역구: {detail.city}
                    </span>
                  </div>
                </div>

                <div className="w-full h-[183px]">
                  <img
                    src={detail.img_url}
                    alt="코스 이미지"
                    className="w-full h-full border border-gray-[#888888] rounded-md object-cover"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-200 rounded-md h-fit text-[#888888] break-words">
                <p className="indent-4 h-full">{detail.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 p-4 bg-white">
        {isUserOwner ? (
          <div className="flex justify-between gap-x-4 font-semibold">
            <Link className="w-full" to={"/update_course"} state={detail}>
              <button className="w-full bg-yellow-300 py-2 rounded-xl hover:bg-yellow-400 hover:shadow-md">
                수정
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="w-full bg-red-300 py-2 rounded-xl hover:bg-red-400 hover:shadow-md"
            >
              삭제
            </button>
            <button
              onClick={handleBack}
              className="w-full bg-purple-400 py-2 rounded-xl hover:bg-purple-500 hover:shadow-md"
            >
              시작하기
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleBack}
              className="w-full bg-purple-400 py-2 rounded-xl hover:bg-purple-500 hover:shadow-md"
            >
              시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
