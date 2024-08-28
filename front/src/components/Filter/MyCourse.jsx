import React, { useEffect } from "react";
import Item from "./Item";

import { useDispatch, useSelector } from "react-redux";

import { fetchGetUserData } from "../../redux/slices/userSlice";
import { fetchGetMyCourseData } from "../../redux/slices/apiSlice";

const MyCourse = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.authData.name);
  const myCourseData = useSelector((state) => state.api.getMyCourseData);

  const user = useSelector((state) => state.user.data);

  if (user !== null) {
    console.log(user[0].user_table_idx);
  }

  useEffect(() => {
    if (!userId) {
      return;
    }

    dispatch(fetchGetUserData(userId));
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetMyCourseData(3)).unwrap();
      } catch (error) {
        console.log("Failed to fetch items:", error);
      }
    };
    fetchGetCourse();
  }, [dispatch, userId]);

  return (
    <div className="my-course">
      MyCourse
      <div className="grid grid-cols-2 w-full">
        {myCourseData?.map((item, idx) => (
          <Item key={idx} item={item}></Item>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
