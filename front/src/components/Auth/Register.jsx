import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [values, setValues] = useState({
    user_id: null,
    user_email: null,
    password: null,
    ck_pw: null,
    user_name: null,
  });

  const navigate = useNavigate();

  // const ck_pw = false;
  // const check_password = (e) => {
  //   console.log(e.target.value);
  //   console.log(values.password);
  //   if (values.password === e.target.value) {
  //     ck_pw = true;
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.user_id) {
      alert("아이디를 입력해주세요");
      return;
    }
    if (!values.user_email) {
      alert("이메일을 입력해주세요");
      return;
    }
    if (!values.password) {
      alert("패스워드를 입력해주세요");
      return;
    }
    if (!values.user_name) {
      alert("닉네임을 입력해주세요");
      return;
    }
    if (values.ck_pw !== values.password) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    axios
      .post("http://localhost:8080/register", values)
      .then((res) => {
        if (res.status === 201) {
          navigate("/login");
        } else {
          alert("회원가입에 실패하였습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="register">
      <div className="register-wrapper">
        <h2>Sign-Up</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full p-4 flex flex-col gap-y-4"
        >
          <div className="auth-form">
            <label htmlFor="user_id">
              <strong>id</strong>
            </label>
            <input
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
            <label htmlFor="password">
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
            <label htmlFor="check-password">
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
            <label htmlFor="user_email">
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
            <label htmlFor="user_name">
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

          <button type="submit" className="btn w-20">
            가입하기
          </button>

          <button className="btn w-20">
            <Link to="/login">로그인하기</Link>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
