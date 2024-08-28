import React, { useEffect } from "react";
import Item from "./Item";

import { useDispatch, useSelector } from "react-redux";

import { fetchGetUserData } from "../../redux/slices/userSlice";
import { fetchGetCourseData } from "../../redux/slices/apiSlice";

const MyCourse = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.authData.name);

  useEffect(() => {
    dispatch(fetchGetUserData(userId));
  }, [dispatch]);

  const getCourseData = useSelector((state) => state.api.getCourseData);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
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
  }, [dispatch, userId]);

  // const filteredCourse = getCourseData?.filter(
  //   (course) => course.user_id === userName
  // );
  // console.log(filteredCourse);

  return (
    <div className="my-course">
      MyCourse
      <div className="grid grid-cols-2 w-full">
        {getCourseData?.map((item, idx) => (
          <Item key={idx} item={item}></Item>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
