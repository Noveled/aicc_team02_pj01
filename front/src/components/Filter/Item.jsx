import React from "react";
import { Link } from "react-router-dom";

import test from "../test.jpg";

const Item = () => {
  return (
    <div className="item">
      <Link to={"/detail"}>
        <div>
          <img src={test} alt="" className="h-[100px]" />
          <h6>title</h6>
          <div className="text-sm">위치</div>
        </div>
      </Link>
    </div>
  );
};

export default Item;
