import React from "react";
import { Link } from "react-router-dom";

const Item = () => {
  return (
    <div>
      Item
      <Link to={"/detail"}>
        <div>detail</div>
      </Link>
    </div>
  );
};

export default Item;
