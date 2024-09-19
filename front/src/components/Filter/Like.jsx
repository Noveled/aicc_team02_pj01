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

    const fetchGetCourse = async () => {
      setLoading(true);
      try {
        await dispatch(fetchGetUsersData()).unwrap();
        await dispatch(fetchGetUserJoinCourseData(userId)).unwrap();
      } catch (error) {
        console.log("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGetCourse();
  }, [dispatch, userId, myCourse]);

  return (
    <div className="my-course bg-violet-50">
      <div className="grid grid-cols-6 w-full xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          <SkeletonTheme baseColor="#ddd6fe" highlightColor="#c4b5fd">
            <ItemLoadingSkeleton />
            <ItemLoadingSkeleton />
            <ItemLoadingSkeleton />
            <ItemLoadingSkeleton />
          </SkeletonTheme>
        ) : (
          myCourse
            ?.filter((item) => item.is_visible === true)
            ?.map((item) => <Item key={item.course_id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default Like;
