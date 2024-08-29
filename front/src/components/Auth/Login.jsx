import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
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
      alert("아이디를 입력해주세요");
      return;
    }
    if (!values.password) {
      alert("패스워드를 입력해주세요");
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
            .get(`http://localhost:8080/get_user/${decoded['name']}`)
            .then((res) => {
              if (res.status === 200) {
                console.log('res.data', res.data[0]);
                dispatch(updateUserInfo(res.data[0]));
              } else {
                alert('유저 정보 업데이트 실패');
              }
            })
            .catch((error) => {
              console.log(error);
          });
          navigate("/");
        } else {
          alert("로그인에 실패하였습니다.");
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <div>
      <h2>Sign-In</h2>
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
            placeholder="Enter Your ID..."
            name="user_id"
            className="form-control"
            onChange={(e) => setValues({ ...values, user_id: e.target.value })}
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
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn w-[20%]">
          Sign In
        </button>
        {/* <p>Agree to our Terms and Policies</p> */}
        <button className="btn w-40">
          <Link to="/register">Create Account</Link>
        </button>
      </form>
    </div>
  );
};

export default Login;
