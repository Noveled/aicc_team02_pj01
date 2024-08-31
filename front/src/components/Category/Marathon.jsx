import React, { useEffect } from "react";
import Item from "../Filter/Item";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetUsersJoinCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

const Marathon = () => {
  const dispatch = useDispatch();

  const courseData = useSelector((state) => state.api.usersCourse);

  useEffect(() => {
    dispatch(fetchGetUsersData());
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetUsersJoinCourseData()).unwrap();
      } catch (error) {
        console.log("Failed to fetch items:", error);
      }
    };
    fetchGetCourse();
  }, [dispatch]);

  const marathonCourse = courseData?.filter(
    (course) =>
      course.is_marathon === true &&
      course.is_private === false &&
      course.is_visible === true
  );

  return (
    <div className="marathon">
      <div className="flex overflow-x-auto w-full">
        {marathonCourse?.map((item, idx) => (
          <div className="category-items w-[195px]">
            <Item key={idx} item={item}></Item>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marathon;
