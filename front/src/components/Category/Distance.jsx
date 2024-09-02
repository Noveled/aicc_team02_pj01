import React, { useEffect, useState } from "react";
import Item from "../Filter/Item";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetUsersJoinCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

const Distance = () => {
  const dispatch = useDispatch();
  const tmp = useSelector((state) => state.api.usersCourse);
  const [courseData, setCourseData] = useState();
  const [dis, setDis] = useState(0);

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

  useEffect(() => {
    if (dis === 0) {
      setCourseData(
        tmp?.filter(
          (course) => course.distance < 5 && course.is_private === false
        )
      );
    } else if (dis === 5) {
      setCourseData(
        tmp?.filter(
          (course) =>
            course.distance >= 5 &&
            course.distance < 10 &&
            course.is_private === false
        )
      );
    } else {
      setCourseData(
        tmp?.filter(
          (course) =>
            course.distance >= 10 &&
            course.is_private === false &&
            course.is_visible === true
        )
      );
    }
  }, [dis, tmp]);

  return (
    <div className="distance-wrapper">
      <div className="flex justify-between px-4 gap-4">
        <button
          className={`distance-btn ${dis === 0 ? "bg-sky-300" : "bg-sky-200"}`}
          onClick={() => setDis(0)}
        >
          5km 미만
        </button>
        <button
          className={`distance-btn ${dis === 5 ? "bg-sky-300" : "bg-sky-200"}`}
          onClick={() => setDis(5)}
        >
          5~10km
        </button>
        <button
          className={`distance-btn ${dis === 10 ? "bg-sky-300" : "bg-sky-200"}`}
          onClick={() => setDis(10)}
        >
          10km 이상
        </button>
      </div>

      <div className="py-2">
        <div className="flex overflow-x-auto w-full">
          {courseData?.map((item, idx) => (
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
