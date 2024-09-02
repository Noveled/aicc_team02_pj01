import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import banner_001 from "../assets/images/Recommend_001.PNG";
import banner_002 from "../assets/images/Recommend_002.PNG";
import banner_003 from "../assets/images/Recommend_003.PNG";

import { X } from 'lucide-react';

const Recommend = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleLocalStorage = {
    setItem: (name, days) => {
      const expirationDate = new Date().getTime() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem(name, expirationDate);
    },
    isItemValid: (name) => {
      const now = new Date().getTime();
      return parseInt(localStorage.getItem(name), 10) > now;
    },
  };

  useEffect(() => {
    const popupElement = document.querySelector(".recommendCoursePop");
    if (popupElement) {
      if (handleLocalStorage.isItemValid("today")) {
        popupElement.classList.add("closeToday");
      } else {
        popupElement.classList.remove("closeToday");
      }
      
      if (!isPopupVisible) {
        popupElement.classList.add("close");
      } else {
        popupElement.classList.remove("close");
      }
    }
  }, [isPopupVisible]);

  const handleClose = () => {
    setIsPopupVisible(false);
  };

  const handleTodayClose = () => {
    handleLocalStorage.setItem("today", 1);
    handleClose();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="recommendCoursePop absolute rounded-lg w-11/12 top-8 px-8 pt-4 bg-[#7c5ecf] text-white shadow-lg z-50">
        <div className="box-border text-xl text-center font-semibold">오늘의 추천 코스</div>
        <Slider className="w-full my-4" {...sliderSettings}>
          <div className="mx-[2px] w-[370px] p-1">
            <img className="w-full" src={banner_001} alt="추천 코스 1" />
          </div>
          <div className="mx-[2px] w-[370px] p-1">
            <img className="w-full" src={banner_002} alt="추천 코스 2" />
          </div>
          <div className="mx-[2px] w-[370px] p-1">
            <img className="w-full" src={banner_003} alt="추천 코스 3" />
          </div>
        </Slider>
        <div className="flex gap-2 justify-center">
          <button onClick={handleTodayClose} className="box-border border border-gray-200 rounded-3xl p-1 text-[12px] right-2 text-right font-semibold my-2">
            1일 동안 보지 않기
          </button>
          <button onClick={handleClose} className="box-border border border-gray-200 rounded-3xl px-2 py-1 text-[12px] right-2 text-right font-semibold my-2">
            닫기
          </button>
        </div>
        
      </div>
    </div>
    
  );
};

export default Recommend;
