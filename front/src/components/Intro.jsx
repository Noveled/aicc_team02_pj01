import React from "react";
import Main from "./Main";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
                <img
                  src={intro1}
                  alt="소개페이지 1"
                  className="h-[870px] object-cover"
                />
                <img
                  src={intro3}
                  alt="소개페이지 3"
                  className="h-[870px] object-cover"
                />
                <img
                  src={intro4}
                  alt="소개페이지 4"
                  className="h-[870px] object-cover"
                />
              </Slider>
            </div>
            <button className="absolute top-2 right-2 px-4 py-2 bg-purple-200 rounded-md text-violet-700">
              <Link to="/login">로그인</Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intro;
