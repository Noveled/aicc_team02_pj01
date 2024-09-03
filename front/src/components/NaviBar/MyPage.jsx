import React from 'react';

import FooterNaviBar from './FooterNaviBar';

import { logout } from '../../redux/slices/authSlice';
import { deleteUserInfo } from '../../redux/slices/userInfoSlice';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { IoMdSettings } from 'react-icons/io';
import profile_image from '../../assets/images/profile_image.jpg';
import current_weight from '../../assets/images/current_weight.jpg';
import weight_icon from '../../assets/images/weight_icon.png';
import myActivity from '../../assets/images/myActivity.png';

import { FiSettings } from 'react-icons/fi';
import { FaArrowRightToBracket } from 'react-icons/fa6';
import { TbShoe } from 'react-icons/tb';
import { LiaCalendarDaySolid } from 'react-icons/lia';

const MyPage = () => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.userInfoState);
  console.log(userData);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(deleteUserInfo());
  };

  const handleback = () => {
    window.history.back();
  };

  return (
    <div className="my-page w-full px-4">
      <div className="my-page-wrapper flex flex-col py-7">
        <div className="mypage-upper flex flex-col gap-5">
          <div className="flex justify-between">
            <button onClick={handleback}>
              <ChevronLeft />
            </button>
            <span className="text-[20px] text-[#7c5ecf] rounded-md px-2 w-full text-center py-1">
              마이 페이지
            </span>
            <button>
              <IoMdSettings />
            </button>
          </div>
          <div className="mypage_image relative flex  justify-center">
            <div className="relative ">
              <div className="border  w-20 h-20 overflow-hidden border-gray-200 rounded-full">
                <img className="w-20 " src={userData.userInfo.url} />
              </div>
              <span className="absolute top-[53px] left-[65px] h-[20px] w-[20px] rounded-3xl z-10">
                <FiSettings />
              </span>
            </div>
          </div>
          <div>
            <span className="user_name text-xl flex justify-center">
              {userData.userInfo.user_name}
            </span>
            <span className="nick_name text-sm flex justify-center">
              Snowman Running
            </span>
          </div>
        </div>

        <div className="mypage_record1 p-8">
          <p className="text-[16px] border border-gray-100 bg-[#fffaf0] text-[#7c5ecf] text-bold rounded-md px-2 w-full text-center py-1 shadow">
            현재 달성치
          </p>
          <div className="mapage_r1_upper flex justify-center w-full max-w-md mx-auto space-x-[44px] pt-2">
            <div className="course flex gap-2 items-center">
              <TbShoe className="w-12 h-12" />
              <div className="course_left flex flex-col items-center">
                <span className="text-sm">코스</span>
                <span className="font-bold text-base">5</span>
              </div>
            </div>
            <div className="daily flex gap-2 items-center">
              <LiaCalendarDaySolid className="w-12 h-12" />
              <div className="daily_left flex flex-col items-center">
                <span className="text-sm">활동량</span>
                <span className="font-bold text-base">5/week</span>
              </div>
            </div>
          </div>

          <div className="current-exercise w-full mt-4 ">
            <div className="WeightChange_upper flex md:flex-row items-center justify-center gap-4">
              <img
                className="w-[120px] md:w-[160px]"
                src={current_weight}
                alt="Current Weight"
              />
              <div className="Current_left flex flex-col w-full max-w-xs">
                <div className="Weight_Change flex items-center gap-2">
                  <img
                    className="w-6 h-6"
                    src={weight_icon}
                    alt="Weight Icon"
                  />
                  <p className="text-base">몸무게</p>
                </div>
                <div className="Target flex flex-col mt-4">
                  <p>목표</p>
                  <div className="Target_bottom flex justify-between items-center mt-2">
                    <span>101.5 kg</span>
                    <FaArrowRightToBracket />
                    <span>65.5 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my_page_record2   pb-8 px-8">
          <p className="text-[16px] border border-gray-100 bg-[#fffaf0] text-[#7c5ecf] text-bold rounded-md px-2 w-full text-center py-1 shadow mb-2">
            주간 활동량
          </p>
          <div className="flex justify-center">
            <img src={myActivity} alt="Current Weight" />
          </div>
        </div>

        <Link to={'/'}>
          <div
            onClick={handleLogout}
            className="border border-gray-400 bg-[#7c5ecf] rounded-md px-2 cursor-pointer text-white w-full text-center py-2 mt-4"
          >
            로그아웃
          </div>
        </Link>
      </div>
      <FooterNaviBar></FooterNaviBar>
    </div>
  );
};

export default MyPage;
