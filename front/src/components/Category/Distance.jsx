import React, { useEffect } from "react";
import Item from "../Filter/Item";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetUsersJoinCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

const Distance = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.authData.name);
  const courseData = useSelector((state) => state.api.usersCourse);

  useEffect(() => {
    if (!userId) {
      return;
    }

    dispatch(fetchGetUsersData());
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetUsersJoinCourseData()).unwrap();
      } catch (error) {
        console.log("Failed to fetch items:", error);
      }
    };
    fetchGetCourse();
  }, [dispatch, userId]);

  const toFiveCourse = courseData?.filter(
    (course) => course.distance < 5 && course.is_private === false
  );
  const fromFivetoTenCourse = courseData?.filter(
    (course) =>
      course.distance >= 5 &&
      course.distance < 10 &&
      course.is_private === false
  );
  const overTenCourse = courseData?.filter(
    (course) =>
      course.distance >= 10 &&
      course.is_private === false &&
      course.is_visible === true
  );

  return (
    <div className="distance-wrapper">
      <div className="py-2">
        <div className="distance-title">5km 미만</div>
        <div className="flex overflow-x-auto w-full">
          {toFiveCourse?.map((item, idx) => (
            <div className="category-items w-[195px]">
              <Item key={idx} item={item}></Item>
            </div>
          ))}
        </div>
      </div>

      <div className="py-2">
        <div className="distance-title">5~10km</div>
        <div className="flex overflow-x-auto w-full">
          {fromFivetoTenCourse?.map((item, idx) => (
            <div className="category-items w-[195px]">
              <Item key={idx} item={item}></Item>
            </div>
          ))}
        </div>
      </div>

      <div className="py-2">
        <div className="distance-title">10km 이상</div>
        <div className="flex overflow-x-auto w-full">
          {overTenCourse?.map((item, idx) => (
            <div className="category-items w-[195px]">
              <Item key={idx} item={item}></Item>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Distance;
