import React, { useState } from "react";
import AuthHeader from "./AuthHeader";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

import { GiRunningShoe } from "react-icons/gi";
import { toast } from "react-toastify";
import axios from "axios";

import { login } from "../../redux/slices/authSlice";
import { updateUserInfo } from "../../redux/slices/userInfoSlice";

const Login = () => {
  const [values, setValues] = useState({
    user_id: null,
    password: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.user_id) {
      toast.error("아이디를 입력해주세요");
      return;
    }
    if (!values.password) {
      toast.error("패스워드를 입력해주세요");
      return;
    }
    axios
      .post("http://localhost:8080/login", values)
      .then((res) => {
        if (res.status === 201) {
          const decoded = jwtDecode(res.data.token);
          // console.log(decoded['name']);
          dispatch(login({ authData: decoded }));

          axios
            .get(`http://localhost:8080/get_user/${decoded["name"]}`)
            .then((res) => {
              if (res.status === 200) {
                console.log("res.data", res.data[0]);
                dispatch(updateUserInfo(res.data[0]));
              } else {
                toast.error("유저 정보 업데이트 실패");
              }
            })
            .catch((error) => {
              console.log(error);
            });
          navigate("/");
        } else {
          toast.error("로그인에 실패하였습니다.");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const signUp = () => {
    navigate("/register");
  };

  return (
    <div className="login h-[100vh] bg-gradient-to-b from-violet-400 to-purple-500 bg">
      <AuthHeader title="로그인"></AuthHeader>
      <form
        onSubmit={handleSubmit}
        className="w-full px-10 flex flex-col justify-between h-[35vh]"
      >
        <div className="auth-form">
          <label htmlFor="user_id" className="px-2">
            <strong>id</strong>
          </label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            name="user_id"
            className="form-control"
            onChange={(e) => setValues({ ...values, user_id: e.target.value })}
          />
        </div>

        <div className="auth-form">
          <label htmlFor="password" className="px-2">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            name="password"
            className="form-control"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-4 py-4">
          <button
            type="submit"
            className="auth-btn bg-[#B3E0FF] hover:bg-gradient-to-b from-sky-200 to-sky-300"
          >
            Sign In
          </button>
          <div
            className="auth-btn cursor-pointer bg-[#F5A3B1] hover:bg-gradient-to-b from-pink-200 to-pink-300"
            onClick={signUp}
          >
            Create Account
          </div>
        </div>
      </form>
      <div className="h-[35vh] pb-10 flex justify-center items-center">
        <GiRunningShoe className="w-[50%] h-[50%] text-purple-50" />
      </div>
    </div>
  );
};

export default Login;
