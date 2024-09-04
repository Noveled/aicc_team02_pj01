import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import axios from "axios";

import { fetchGetUsersData } from "../../redux/slices/usersSlice";
import AuthHeader from "./AuthHeader";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchGetUsersData());
  }, [dispatch]);
  const users = useSelector((state) => state.users.data);

  const id_check = () => {
    const compareId = document.getElementById("id").value;
    if (!compareId) {
      toast.error("아이디를 입력해주세요");
      return;
    }
    // 사용자 ID가 존재하는지 확인
    const isIdTaken = users?.some((user) => user.user_id === compareId);

    if (isIdTaken) {
      toast.error("중복된 아이디입니다.");
    } else {
      toast.success("사용 가능한 아이디입니다.");
    }
  };

  const [values, setValues] = useState({
    user_id: null,
    user_email: null,
    password: null,
    ck_pw: null,
    user_name: null,
  });

  const id_double_check = (id) => {
    const isIdTaken = users?.some((user) => user.user_id === id);
    if (isIdTaken) {
      return true;
    } else {
      return false;
    }
  };
  const email_check = (email) => {
    const isEmailTaken = users?.some((user) => user.user_email === email);
    if (isEmailTaken) {
      return true;
    } else {
      return false;
    }
  };
  const nickname_check = (name) => {
    const isNameTaken = users?.some((user) => user.user_name === name);
    if (isNameTaken) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id_double_check(values.user_id)) {
      toast.error("이미 다른 유저가 사용하는 아이디입니다.");
      return;
    }
    if (email_check(values.user_email)) {
      toast.error("이미 가입되어 있는 이메일입니다.");
      return;
    }
    if (nickname_check(values.user_name)) {
      toast.error("다른유저가 사용하는 닉네임입니다.");
      return;
    }

    if (!values.user_id) {
      toast.error("아이디를 입력해주세요");
      return;
    }
    if (!values.user_email) {
      toast.error("이메일을 입력해주세요");
      return;
    }
    if (!values.password) {
      toast.error("패스워드를 입력해주세요");
      return;
    }
    if (!values.user_name) {
      toast.error("닉네임을 입력해주세요");
      return;
    }
    if (values.ck_pw !== values.password) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    axios
      .post("http://localhost:8080/register", values)
      .then((res) => {
        if (res.status === 201) {
          toast.success("회원가입 되었습니다.");
          navigate("/login");
        } else {
          toast.error("회원가입에 실패하였습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelSignUp = () => {
    navigate("/");
  };
  const login = () => {
    navigate("/login");
  };

  return (
    <div className="register h-[100vh] bg-gradient-to-b from-violet-400 to-purple-500 bg">
      <AuthHeader title="회원가입"></AuthHeader>
      <div className="register-wrapper px-10 h-[70vh]">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col justify-between pb-10"
        >
          <div className="auth-form">
            <div className="flex justify-between">
              <label htmlFor="user_id" className="px-2">
                <strong>id</strong>
              </label>
              <div
                className="text-xs rounded bg-purple-200 px-4 cursor-pointer flex items-center"
                onClick={id_check}
              >
                아이디 중복확인
              </div>
            </div>
            <input
              id="id"
              type="text"
              placeholder="아이디를 입력해주세요"
              name="user_id"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, user_id: e.target.value })
              }
            />
          </div>

          <div className="auth-form">
            <label htmlFor="password" className="px-2">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              name="password"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <div className="auth-form">
            <label htmlFor="check-password" className="px-2">
              <strong>Check password</strong>
            </label>
            <input
              type="password"
              placeholder="비밀번호 확인"
              name="check-password"
              className="form-control"
              onChange={(e) => setValues({ ...values, ck_pw: e.target.value })}
            />
          </div>

          <div className="auth-form">
            <label htmlFor="user_email" className="px-2">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              name="user_email"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, user_email: e.target.value })
              }
            />
          </div>

          <div className="auth-form">
            <label htmlFor="user_name" className="px-2">
              <strong>Nick Name</strong>
            </label>
            <input
              type="user_name"
              placeholder="닉네임을 입력해주세요"
              name="user_name"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, user_name: e.target.value })
              }
            />
          </div>

          <div className="flex justify-between gap-x-4 py-4">
            <button
              type="submit"
              className="auth-btn text-sm bg-green-400 shadow text-white hover:font-bold"
            >
              가입하기
            </button>

            <div
              className="auth-btn text-sm cursor-pointer bg-amber-400 text-slate-100 hover:font-bold"
              onClick={login}
            >
              로그인
            </div>

            <div
              className="auth-btn text-sm cursor-pointer  bg-red-400 shadow text-white hover:font-bold"
              onClick={cancelSignUp}
            >
              가입취소
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
