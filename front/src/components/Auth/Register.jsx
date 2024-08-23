import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [values, setValues] = useState({
    user_name: null,
    user_email: null,
    password: null,
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.user_name) {
      alert("이름을 입력해주세요");
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
    <div>
      <div>
        <h2>Sign-Up</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full p-4 flex flex-col gap-y-4"
        >
          <div className="auth-form">
            <label htmlFor="user_name">
              <strong>id</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Your Name..."
              name="user_name"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, user_name: e.target.value })
              }
            />
          </div>

          <div className="auth-form">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Your Password..."
              name="password"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <div className="auth-form">
            <label htmlFor="user_email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Your Email..."
              name="user_email"
              className="form-control"
              onChange={(e) =>
                setValues({ ...values, user_email: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn w-20">
            Sign Up
          </button>
          <p>Agree to our Terms and Policies</p>
          <button className="btn w-20">
            <Link to="/login">Sign In</Link>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
