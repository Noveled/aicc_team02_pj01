import React from "react";

import { ChevronLeft } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';

const HeaderNaviBar = () => {
  return (
    <div className="header-navi">
      <div className="header-wrapper flex justify-between">
        <div className="header-left-section">
          <ChevronLeft />
        </div>
        <div className="header-middle-section"></div>
        <div className="header-right-section">
          <Share2 />
          <EllipsisVertical />
        </div>
      </div>
    </div>
  );
};

export default HeaderNaviBar;
