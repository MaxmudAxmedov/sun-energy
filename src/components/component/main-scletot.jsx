import React from "react";
import { Skeleton } from "../ui/skeleton";

export const MainScletot = () => {
  return (
    <div>
      <div className="flex items-center justify-between desktop:mt-6 tablet:mt-3 mt-1">
        <Skeleton className="w-[200px] h-[40px] rounded-md" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="w-[300px] h-[40px] rounded-md" />
          <Skeleton className="w-[200px] h-[40px] rounded-md" />
        </div>
      </div>
      <Skeleton className="max-w-full h-[450px] mt-2 tablet:mt-4 desktop:mt-8 rounded-md" />
      <div className="flex items-center gap-x-3 mt-4">
        <Skeleton className="w-[90px] h-[30px] rounded-md" />
        <div className="flex items-center gap-x-1">
          <Skeleton className="w-[20px] h-[20px] rounded-md" />
          <Skeleton className="w-[30px] h-[20px] rounded-md" />
          <Skeleton className="w-[20px] h-[20px] rounded-md" />
        </div>
        <Skeleton className="w-[65px] h-[30px] rounded-md" />
      </div>
    </div>
  );
};
