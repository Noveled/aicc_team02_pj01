import React, { useEffect } from "react";
import Item from "./Item";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetCourseData } from "../../redux/slices/apiSlice";

const MyCourse = () => {
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.auth.authData.name);
  const getCourseData = useSelector((state) => state.api.getCourseData);
  // const [loading, setLoading] = useState(false);

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

  const filteredCourse = getCourseData?.filter(
    (course) => course.user_id === userName
  );
  // console.log(filteredCourse);

  return (
    <div className="my-course">
      MyCourse
      <div className="grid grid-cols-2 w-full">
        {filteredCourse?.map((item, idx) => (
          <Item key={idx} item={item}></Item>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
