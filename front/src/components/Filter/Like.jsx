import React, { useEffect } from "react";
import Item from "./Item";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetCourseData } from "../../redux/slices/apiSlice";

const Like = () => {
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
  }, [dispatch, userName]);

  return (
    <div className="like">
      즐겨찾기
      {/* <Item></Item> */}
    </div>
  );
};

export default Like;
