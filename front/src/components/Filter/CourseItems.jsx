import React from "react";
import Item from "./Item";

const CourseItems = () => {
  return (
    <div className="course-items">
      <div className="flex gap-x-4 overflow-x-auto ">
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
        <Item></Item>
      </div>
    </div>
  );
};

export default CourseItems;
