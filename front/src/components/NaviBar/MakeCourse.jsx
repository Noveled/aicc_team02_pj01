import React, { useState } from "react";
import FooterNaviBar from "./FooterNaviBar";
import Map from "../Map";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MakeCourse = () => {
  const [values, setValues] = useState({
    course_name: null,
    user_id: 3, // 임시
    content: null,
    distance: 4, // 임시
    waypoint:
      '[{"La":126.57148654813169,"Ma":33.44908974922391},{"La":126.57156669275028,"Ma":33.450289156520846},{"La":126.57324468173204,"Ma":33.4502588789353},{"La":126.574075036090391},{"La":126.571566696,"Ma":33.44981093306277},{"La":126.57374621326552,"Ma":33.448872137126685},{"La":126.57179813467792,"Ma":33.44915393774874}]', // 임시
    city: null,
    center: '[{"La":126.57179813467792,"Ma":33.44915393774874}]', // 임시
    level: 3, // 임시
    is_private: false, // 임시
  });

  const selectCity = (e) => {
    setValues({ ...values, city: e.target.value });
  };

  const is_checked = (e) => {
    setValues({ ...values, is_private: e.target.checked });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.course_name) {
      alert("코스이름을 입력해주세요");
      return;
    }
    if (!values.city || values.city === "select") {
      alert("자치구를 선택해주세요");
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

          <div className="city">
            <label htmlFor="city">
              <strong>자치구</strong>
            </label>
            <select
              name="자치구"
              id="city"
              className="form-control"
              onChange={selectCity}
              // onChange={(e) => setValues({ ...values, city: e.option.value })}
            >
              <option value="select">자치구</option>
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

          <div className="is_private">
            <label htmlFor="is_private">
              <strong>비밀경로</strong>
            </label>
            <input
              type="checkbox"
              name="is_private"
              className="form-control"
              onClick={is_checked}
            />
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
