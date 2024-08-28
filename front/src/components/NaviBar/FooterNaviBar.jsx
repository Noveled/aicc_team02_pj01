import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCurrentPage } from "../../redux/slices/currentStateSlice";

import { MapPin } from 'lucide-react';
import { Flag } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Route } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import FooterNavIcon from "./FooterNavIcon";

const FooterNaviBar = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentState.currentPage);

  const handleChangePage = (pageName) => {
    dispatch(changeCurrentPage(pageName));
  };
  
  // console.log('currentPage', currentPage);
  return (
    <div className="footer-navi shadow">
      <div className="footer-wrapper grid grid-cols-5">
        <FooterNavIcon icon={<MapPin />} linkTo="/main" title="주변" func={handleChangePage} />

        <FooterNavIcon icon={<Flag />} linkTo="/search" title="코스" func={handleChangePage} />
        
        <FooterNavIcon icon={<Route />} linkTo="/make_course" title="코스등록" func={handleChangePage} />

        <FooterNavIcon icon={<Inbox />} linkTo="/box" title="보관함" func={handleChangePage} />

        <FooterNavIcon icon={<CircleUserRound />} linkTo="/mypage" title="MY" func={handleChangePage} />
      </div>
    </div>
  );
};

export default FooterNaviBar;
