import React from "react";

import { Link } from "react-router-dom";
import { FaEdit, FaThumbsUp, FaTrash } from "react-icons/fa";

const Item = ({ item }) => {
  console.log(item);
  const deleteItem = () => {};

  return (
    <div className="item w-full p-3">
      <div className="rounded-lg p-2 bg-sky-200">
        <Link to={"/detail"} state={{ item: item }}>
          <div className="flex flex-col gap-y-1">
            <img src={item.thumbnail_id} alt="" />
            <h5 className="truncate">제목: {item.course_name}</h5>
            <p className="truncate">내용: {item.content}</p>
            <div className="flex justify-between gap-x-[2px]">
              <div className="text-xs truncate">지역구: {item.city}</div>
              <div className="text-xs truncate">작성자: {item.user_name}</div>
              <div className="text-xs truncate">거리: {item.distance}km</div>
            </div>

            <div className="flex justify-between">
              <div className="text-sm flex items-center gap-x-1">
                <FaThumbsUp /> <div>{item.liked}</div>
              </div>
              <div className="flex text-sm gap-2">
                <button>
                  <FaEdit />
                </button>
                <button onClick={deleteItem}>
                  <FaTrash />
                </button>
              </div>
            </div>
            {/* <div>사진링크: {item}</div> */}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Item;
