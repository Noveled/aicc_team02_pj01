import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ChevronLeft, FilePenLine, Trash } from "lucide-react";

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
        <div>
          {user.user_id === detail.user_id ? (
            <div className="detail-header">
              <button onClick={back}>
                <ChevronLeft className="w-10 h-10 cursor-pointer" />
              </button>
              <div className="flex items-center gap-x-4">
                <Link to={"/update_course"} state={{ item: detail }}>
                  <FilePenLine className="w-7 h-7 cursor-pointer" />
                </Link>
                <button onClick={deleteItem}>
                  <Trash className="w-7 h-7 cursor-pointer" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex fixed left-5 top-5 bg-slate-600 w-10 h-10 rounded-full text-[#ddd]">
              <button onClick={back}>
                <ChevronLeft className="w-10 h-10 cursor-pointer" />
              </button>
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

        <div className="w-full h-[50vh] bg-gray-900 p-8 text-gray-200">
          <div className="flex flex-col justify-between h-full text-base">
            <h5 className="">제목: {detail.course_name}</h5>
            <p className="">내용: {detail.content}</p>
            <div className="">지역구: {detail.city}</div>
            <div className="">작성자: {detail.user_name}</div>
            <div className="">거리: {detail.distance}km</div>
            <div className="">조회수: {detail.viewcount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
