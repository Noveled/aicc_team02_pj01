import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ChevronLeft, Sparkle } from "lucide-react";
import { GiDiamonds } from "react-icons/gi";

import { fetchDeleteCourse } from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";

const Detail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const detail = location.state.item;

  const back = () => {
    window.history.back();
  };

  const user = useSelector((state) => state.userInfoState.userInfo);

  const deleteItem = async () => {
    const confirm = window.confirm("아이템을 삭제하시겠습니까?");
    if (!confirm) return;
    try {
      await dispatch(fetchDeleteCourse(detail.course_id)).unwrap();
      toast.success("아이템이 삭제되었습니다.");
      navigate("/box");
    } catch (error) {
      toast.error("아이템 삭제에 실패했습니다.");
      console.log(error);
    }
  };

  return (
    <div className="detail">
      <div className="detail-wrapper">
        <div className="relative shadow-[0_1px_6px_5px_rgba(0,0,0,0.2)]">
          {user.user_id === detail.user_id ? (
            <div className="detail-header">
              <button onClick={back} className="fixed left-[1rem] top-0">
                <ChevronLeft className="w-[2.5rem] h-[2.5rem] cursor-pointer items-center" />
              </button>
              <div className="text-xl">코스 상세페이지</div>
            </div>
          ) : (
            <div className="detail-header">
              <div className="text-xl">코스 상세페이지</div>
            </div>
          )}
        </div>

        <div className="h-[50vh]">
          <img
            src={detail.img_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-[#eee] pt-3 px-3 pb-8 text-gray-800 rounded-t-xl shadow-[0_-1px_6px_5px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col justify-between h-full text-base">
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
            <div className="detail-content h-[40%] p-3 bg-purple-200 rounded-md overflow-y-scroll">
              <p className="whitespace-break-spaces indent-4">
                {detail.content}
              </p>
            </div>
            {user.user_id === detail.user_id ? (
              <div className="flex justify-between gap-x-4">
                <button className="w-full bg-yellow-300 py-2 rounded-xl hover:bg-yellow-400 hover:shadow-md">
                  수정
                </button>
                <button
                  onClick={deleteItem}
                  className="w-full bg-red-300 py-2 rounded-xl hover:bg-red-400 hover:shadow-md"
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="">
                <button
                  onClick={back}
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
