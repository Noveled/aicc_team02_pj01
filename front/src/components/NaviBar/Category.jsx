import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import Item from "../Filter/Item";
import ItemLoadingSkeleton from "../Filter/ItemLoadingSkeleton";

import { city_options } from "../../utils/data";
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
  const ct_options = city_options;

  useEffect(() => {
    setLoading(true);
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetUsersJoinCourseData()).unwrap();
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
            <Select
              options={ct_options}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? "purple" : "#7c5ecf",
                }),
              }}
              onChange={(e) => setSelectCity(e.value)}
            ></Select>
          </div>
        )}
      </div>
      <div className="search-content">
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
        <div className="flex w-full text-violet-300 overflow-x-scroll">
          {loading ? (
            <SkeletonTheme baseColor="#ddd6fe" highlightColor="#c4b5fd">
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
              <ItemLoadingSkeleton></ItemLoadingSkeleton>
            </SkeletonTheme>
          ) : (
            showCourse?.map((item) => (
              <div className="category-items w-[195px] xs:basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-1/6">
                <Item key={item.course_id} item={item}></Item>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
