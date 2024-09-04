import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Item from "../Filter/Item";
import ItemLoadingSkeleton from "../Filter/ItemLoadingSkeleton";

import { fetchGetUsersJoinCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Category = ({ title }) => {
  const dispatch = useDispatch();

  const [dis, setDis] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCourse, setShowCourse] = useState();
  const [selectCity, setSelectCity] = useState("강남구");
  const courseData = useSelector((state) => state.api.usersCourse);

  useEffect(() => {
    dispatch(fetchGetUsersData());
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetUsersJoinCourseData()).unwrap();
        setLoading(true);
      } catch (error) {
        console.log("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGetCourse();
  }, [dispatch, selectCity]);

  useEffect(() => {
    if (title === "근처 추천 코스") {
      setShowCourse(
        courseData?.filter(
          (course) =>
            course.city === "강동구" &&
            course.is_private === false &&
            course.is_visible === true
        )
      );
    } else if (title === "지역 추천 코스") {
      setShowCourse(
        courseData?.filter(
          (course) =>
            course.city === selectCity &&
            course.is_private === false &&
            course.is_visible === true
        )
      );
    } else if (title === "산책 추천 코스") {
      setShowCourse(
        courseData?.filter(
          (course) =>
            course.distance <= 5 &&
            course.is_private === false &&
            course.is_visible === true
        )
      );
    } else if (title === "마라톤 추천 코스") {
      setShowCourse(
        courseData?.filter(
          (course) =>
            course.is_marathon === true &&
            course.is_private === false &&
            course.is_visible === true
        )
      );
    } else if ((title = "거리별 코스")) {
      if (dis === 0) {
        setShowCourse(
          courseData?.filter(
            (course) =>
              course.distance < 5 &&
              course.is_private === false &&
              course.is_visible === true
          )
        );
      } else if (dis === 5) {
        setShowCourse(
          courseData?.filter(
            (course) =>
              course.distance >= 5 &&
              course.distance < 10 &&
              course.is_private === false &&
              course.is_visible === true
          )
        );
      } else {
        setShowCourse(
          courseData?.filter(
            (course) =>
              course.distance >= 10 &&
              course.is_private === false &&
              course.is_visible === true
          )
        );
      }
    }
  }, [courseData, title, dis]);

  return (
    <div className="search-items">
      <div className="flex justify-center items-center relative">
        <h4 className="search-title">{title}</h4>
        {title === "지역 추천 코스" && (
          <div className="absolute left-2/3 flex justify-center">
            <select
              name="city"
              id="city"
              className="p-0.5 border border-purple-500 rounded-md text-purple-700"
              value={selectCity}
              onChange={(e) => setSelectCity(e.target.value)}
              size=""
            >
              <option value="" disabled>
                선택
              </option>
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
        )}
      </div>
      <div className="search-content overflow-x-scroll">
        {title === "거리별 코스" && (
          <div className="flex justify-between px-4 gap-4">
            <button
              className={`distance-btn ${
                dis === 0 ? "bg-[#7c5ecf]" : "bg-[#c8b5fc]"
              }`}
              onClick={() => setDis(0)}
            >
              5km 미만
            </button>
            <button
              className={`distance-btn ${
                dis === 5 ? "bg-[#7c5ecf]" : "bg-[#c8b5fc]"
              }`}
              onClick={() => setDis(5)}
            >
              5~10km
            </button>
            <button
              className={`distance-btn ${
                dis === 10 ? "bg-[#7c5ecf]" : "bg-[#c8b5fc]"
              }`}
              onClick={() => setDis(10)}
            >
              10km 이상
            </button>
          </div>
        )}
        <div className="flex w-full text-violet-300">
          {loading ? (
            <SkeletonTheme baseColor="#ddd6fe" highlightColor="#c4b5fd">
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
            </SkeletonTheme>
          ) : (
            showCourse?.map((item, idx) => (
              <div className="category-items w-[195px]">
                <Item key={idx} item={item}></Item>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
