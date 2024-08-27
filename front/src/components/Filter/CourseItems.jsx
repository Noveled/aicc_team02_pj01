import React, { useEffect } from "react";
import Item from "./Item";

import { categoryMenus } from "../../utils/data";

import { useDispatch, useSelector } from "react-redux";

import { fetchGetCourseData } from "../../redux/slices/apiSlice";

const CourseItems = ({ categoryIdx }) => {
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.auth.authData.name);
  const getCourseData = useSelector((state) => state.api.getCourseData);

  useEffect(() => {
    if (!userName) {
      return;
    }

    const fetchGetCourse = async () => {
      try {
        // setLoading(true);
        await dispatch(fetchGetCourseData()).unwrap();
      } catch (error) {
        console.log("Failed to fetch items:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchGetCourse();

    console.log(categoryIdx);
  }, [dispatch, userName]);

  // if (0 === categoryIdx) {
  //   const filtered = getCourseData?.filter(
  //     (course) => course.user_id === userName
  //   );
  // }

  return (
    <div className="course-items">
      <div className="flex gap-x-4 overflow-x-auto">
        {getCourseData?.map((item, idx) => (
          <Item key={idx} item={item}></Item>
        ))}
      </div>
    </div>
  );
};

export default CourseItems;
