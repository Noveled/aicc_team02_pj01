import React from "react";
import { FaWalking } from "react-icons/fa";

const AuthHeader = (props) => {
  return (
    <div className="h-[30vh]">
      <div className="flex justify-center items-center font-bold text-2xl h-[10vh] text-purple-50">
        {props.title}
      </div>
      <div className="h-[20vh] py-8 flex justify-center items-center">
        <FaWalking className="w-full h-full text-purple-50" />
      </div>
    </div>
  );
};

export default AuthHeader;
