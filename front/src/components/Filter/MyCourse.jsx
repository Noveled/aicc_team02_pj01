import React, { useEffect } from "react";
import Item from "./Item";

import { useDispatch, useSelector } from "react-redux";

import { fetchGetUserJoinCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

const MyCourse = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.userInfoState.userInfo.user_id);
  const myCourse = useSelector((state) => state.api.myCourse);

  useEffect(() => {
    if (!userId) {
      return;
    }

    dispatch(fetchGetUsersData());
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetUserJoinCourseData(userId)).unwrap();
      } catch (error) {
        console.log("Failed to fetch items:", error);
      }
    };
    fetchGetCourse();
  }, [dispatch, userId]);

  return (
    <div className="my-course bg-sky-50">
      <div className="grid grid-cols-2 w-full">
        {myCourse
          ?.filter((item) => item.is_visible === true)
          ?.map((item, idx) => (
            <Item key={idx} item={item}></Item>
          ))}
      </div>
    </div>
  );
};

export default MyCourse;
