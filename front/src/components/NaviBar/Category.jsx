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
  }, [dispatch]);

  useEffect(() => {
    if (title === "근처 추천 코스") {
      setShowCourse(
        courseData?.filter(
          (course) =>
            course.city === "강남구" &&
            course.is_private === false &&
            course.is_visible === true
        )
      );
    } else if (title === "지역 추천 코스") {
      setShowCourse(
        courseData?.filter(
          (course) =>
            course.city === "강북구" &&
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
      <h4 className="search-title">{title}</h4>
      <div className="search-content">
        {title === "거리별 코스" && (
          <div className="flex justify-between px-4 gap-4">
            <button
              className={`distance-btn ${
                dis === 0 ? "bg-sky-300" : "bg-sky-200"
              }`}
              onClick={() => setDis(0)}
            >
              5km 미만
            </button>
            <button
              className={`distance-btn ${
                dis === 5 ? "bg-sky-300" : "bg-sky-200"
              }`}
              onClick={() => setDis(5)}
            >
              5~10km
            </button>
            <button
              className={`distance-btn ${
                dis === 10 ? "bg-sky-300" : "bg-sky-200"
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
