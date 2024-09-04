import React, { useEffect, useState } from "react";
import Item from "./Item";
import ItemLoadingSkeleton from "./ItemLoadingSkeleton";

import { useDispatch, useSelector } from "react-redux";

import { fetchGetUserJoinCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Like = () => {
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
      } catch (error) {
        console.log("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGetCourse();
  }, [dispatch, userId]);

  return (
    <div className="my-course bg-violet-50">
      <div className="grid grid-cols-2 w-full">
        {loading ? (
          <SkeletonTheme baseColor="#ddd6fe" highlightColor="#c4b5fd">
            <ItemLoadingSkeleton></ItemLoadingSkeleton>
            <ItemLoadingSkeleton></ItemLoadingSkeleton>
            <ItemLoadingSkeleton></ItemLoadingSkeleton>
            <ItemLoadingSkeleton></ItemLoadingSkeleton>
          </SkeletonTheme>
        ) : (
          myCourse
            ?.filter((item) => item.is_visible === true)
            ?.map((item, idx) => <Item key={idx} item={item}></Item>)
        )}
        {}
      </div>
    </div>
  );
};

export default Like;
