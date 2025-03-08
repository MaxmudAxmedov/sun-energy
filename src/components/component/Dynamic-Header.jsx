import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { SearchIcon } from "@/assets/icons/search-icon";

export const DynamicHeader = ({
  title,
  btnName,
  btnNavigate,
  inputPlacholder,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mt-8">
      <h1 className="text-textPrimaryColor dark:text-white text-[28px] font-medium">
        {t(title)}
      </h1>
      <div className="flex items-center gap-x-3">
        <div className="flex items-center gap-x-2 pl-4 bg-white dark:bg-gray-700 rounded-[8px] border-[1px] dark:border-[#8C8E90] border-gray5">
          <SearchIcon />
          <input
            placeholder={t(inputPlacholder)}
            type="text"
            className="py-2 bg-transparent pr-10 outline-none placeholder:text-gray3 dark:placeholder:text-[#8C8E90] dark:text-[#8C8E90]"
          />
        </div>
        <NavLink
          className="bg-primaryColor text-white flex gap-2 items-center max-w-[213px] px-4 py-2 rounded-[8px] text-[16px]"
          to={btnNavigate}
        >
          <PlusIcon /> {t(btnName)}
        </NavLink>
      </div>
    </div>
  );
};
