import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";

import { useDispatch, useSelector } from "react-redux";

import { fetchGetUserData } from "../../redux/slices/userSlice";
import { fetchGetCourseData } from "../../redux/slices/apiSlice";
import { fetchGetUsersData } from "../../redux/slices/usersSlice";

const MyCourse = () => {
  const dispatch = useDispatch();
  // const [myCourseData, setMyCourseData] = useState(null);

  const userId = useSelector((state) => state.auth.authData.name);
  // const userData = useSelector((state) => state.auth.authData);
  // console.log("userData", userData);

  // myCourseData 에 해당 유저 데이터만 가져오기

  // setMyCourseData(useSelector((state) => state.api.getCourseData));
  // console.log(myCourseData);

  const user = useSelector((state) => state.user.data);
  const myCourseData = useSelector((state) => state.api.getCourseData);
  console.log(user);

  // useEffect(() => {
  //   console.log(`http://localhost:8080/get_user/${userId}`);
  //   axios
  //     .get(`http://localhost:8080/get_user/${userId}`)
  //     .then((res) => {
  //       // console.log(res);
  //       if (res.status === 200) {
  //         setMyCourseData(res.data);
  //       } else {
  //         alert("내 코스 불러오기 실패했습니다.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  // console.log("myCourseData", myCourseData);

  // console.log('user', user[0]['user_table_idx']);
  // if (user !== null) {
  //   console.log(user[0].user_table_idx);
  // }

  useEffect(() => {
    if (!userId) {
      return;
    }

    console.log(userId);
    dispatch(fetchGetUsersData());
    const fetchGetCourse = async () => {
      try {
        await dispatch(fetchGetCourseData()).unwrap();
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
