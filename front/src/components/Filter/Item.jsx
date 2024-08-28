import React from "react";

import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa6";

const Item = ({ item }) => {
  // console.log(item);
  return (
    <div className="item p-3">
      <div>
        <Link to={"/detail"} state={{ item: item }}>
          <div>
            <h5>제목: {item.course_name}</h5>
            <p>내용: {item.content}</p>
            <div className="text-sm">지역구: {item.city}</div>
            <div className="text-sm">작성자: {item.user_id}</div>
            <div className="text-sm">거리: {item.distance}km</div>
            <div className="text-sm flex items-center">
              <FaThumbsUp /> {item.liked}
            </div>
            {/* <div>사진링크: {item}</div> */}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Item;
