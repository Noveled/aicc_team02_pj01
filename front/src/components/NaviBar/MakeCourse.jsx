import React, { useState } from "react";
import FooterNaviBar from "./FooterNaviBar";
import Map from "../Map";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MakeCourse = () => {
  const user = useSelector((state) => state.auth.authData);

  const [values, setValues] = useState({
    course_name: null,
    user_id: user.name,
    content: null,
    distance: 4,
    waypoint: "test",
    city: "관악구",
    center: "center",
    level: 2,
    is_private: false,
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.course_name) {
      alert("코스이름을 입력해주세요");
      return;
    }

    axios
      .post("http://localhost:8080/make_course", values)
      .then((res) => {
        if (res.status === 201) {
          navigate("/box");
        } else {
          alert("코스등록에 실패하였습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="make-course">
      <Map></Map>
      <div className="make-course-wrapper left-0 w-[100%] h-[50vh] bg-white fixed bottom-0">
        <h2>코스 등록</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full p-4 flex flex-col gap-y-4"
        >
          <div className="course-form">
            <label htmlFor="course_name">
              <strong>코스제목</strong>
            </label>
            <input
              type="text"
              placeholder="코스이름을 지어주세요"
              name="course_name"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, course_name: e.target.value })
              }
            />
          </div>

          <div className="content">
            <label htmlFor="content">
              <strong>설명</strong>
            </label>
            <textarea
              name="contetnt"
              placeholder="코스에 대한 내용을 입력하세요"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, content: e.target.value })
              }
            ></textarea>
          </div>

          <button type="submit" className="btn w-20">
            코스 등록
          </button>
        </form>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default MakeCourse;
