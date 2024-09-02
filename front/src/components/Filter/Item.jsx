import React from "react";

import { Link } from "react-router-dom";

const Item = ({ item }) => {
  return (
    <div className="item w-full p-3 overflow-x-auto">
      <div className="rounded-lg p-3 border border-purple-400 w-full text-gray-700 shadow item-gradiant">
        <Link to={"/detail"} state={{ item: item }}>
          <div className="flex flex-col gap-y-1">
            <div className="h-[155px]">
              <img
                src={item.img_url}
                alt="course_img"
                className="object-cover w-full h-full"
              />
            </div>
            <h5 className="truncate">제목: {item.course_name}</h5>
            <p className="truncate text-[#888888]">내용: {item.content}</p>
            <div className="flex justify-between gap-x-[0.25rem]">
              <div className="text-xs truncate text-[#888888]">지역: {item.city}</div>
              <div className="text-xs truncate text-[#888888]">거리: {item.distance}km</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs truncate text-[#888888]">작성자: {item.user_name}</div>
              <div className="text-xs flex items-center gap-x-1 truncate text-[#888888]">
                조회수: {item.viewcount}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Item;
