import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ItemLoadingSkeleton = () => {
  return (
    <div className="item w-full p-3 overflow-x-auto category-items xs:basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 basis-1/6">
      <div className="rounded-lg p-2 w-full border border-purple-300">
        <div className="flex flex-col gap-y-1">
          <div className="h-[155px]">
            <Skeleton className="h-full"></Skeleton>
          </div>
          <Skeleton width="30%"></Skeleton>
          <Skeleton width="50%"></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default ItemLoadingSkeleton;
