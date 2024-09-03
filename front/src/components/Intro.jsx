import React from "react";
import Main from "./Main";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FaWalking } from "react-icons/fa";

import intro1 from "../assets/images/intro1.png";
import intro2 from "../assets/images/intro2.png";
import intro3 from "../assets/images/intro3.png";
import intro4 from "../assets/images/intro4.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Intro = () => {
  const authData = useSelector((state) => state.auth.authData);
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      {authData ? (
        <Main></Main>
      ) : (
        <div className="flex justify-center h-[100vh] bg-violet-100">
          <div className="relative h-full">
            <div className="h-full overflow-y-hidden  max-w-[390px]">
              <Slider {...settings} className="h-full">
                <div>
                  <img
                    src={intro1}
                    alt="소개페이지 1"
                    className="h-[870px] object-cover"
                  />
                </div>
                <div>
                  <img
                    src={intro3}
                    alt="소개페이지 3"
                    className="h-[870px] object-cover"
                  />
                </div>
                <div>
                  <img
                    src={intro4}
                    alt="소개페이지 4"
                    className="h-[870px] object-cover"
                  />
                </div>
                <div className="p-4 h-[100vh]">
                  <div className="flex flex-col justify-around h-full">
                    <div className="flex justify-center text-purple-700 font-bold text-xl">
                      로그인 또는 회원가입을 해주세요
                    </div>
                    <div>
                      <FaWalking className="w-full h-full text-purple-500" />
                    </div>
                    <div className="flex flex-col gap-y-4 font-bold _text-gray-700">
                      <button className="w-full py-4 bg-[#B3E0FF] hover:bg-gradient-to-b from-sky-200 to-sky-300 bg rounded-xl">
                        <Link to="/login">로그인</Link>
                      </button>
                      <button className="w-full py-4 bg-[#F5A3B1] hover:bg-gradient-to-b from-pink-200 to-pink-300 rounded-xl">
                        <Link to="/register">회원가입</Link>
                      </button>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intro;
