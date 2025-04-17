import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { SearchIcon } from "@/assets/icons/search-icon";
import { PlusIconSmall } from "@/assets/icons/plus-icon-small";
import { useDebounce } from "use-debounce";

export const DynamicHeader = ({
    title,
    btnNavigate,
    inputPlacholder,
    isInput = false,
    onSearch = () => {},
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);

    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="flex flex-col desktop:flex-row desktop:items-center justify-between desktop:mt-5 tablet:mt-3">
            <div className="flex items-center justify-between w-full">
                <h1 className="text-textPrimaryColor dark:text-white text-[18px] desktop:text-[28px] tablet:text-[22px] font-medium">
                    {t(title)}
                </h1>
                <NavLink
                    className="bg-primaryColor desktop:hidden text-white tablet:px-2 tablet:py-2 tablet:text-[14px] flex gap-1 items-center tablet:w-[95px] w-[79px] px-1.5 py-1.5 rounded-[8px] text-[13px]"
                    to={btnNavigate}
                >
                    <PlusIconSmall /> {t("create")}
                </NavLink>
            </div>
            <div className="flex items-center gap-x-3">
                {isInput && (
                    <div className="flex items-center w-full desktop:w-[350px] mb-2 tablet:mb-3 desktop:mb-0 mt-3 tablet:mt-4 desktop:mt-0 gap-x-2 pl-4 bg-white dark:bg-gray-700 rounded-[8px] border-[1px] dark:border-[#8C8E90] border-gray5">
                        <SearchIcon />
                        <input
                            placeholder={t(inputPlacholder)}
                            type="text"
                            value={search}
                            onChange={handleInputChange}
                            className="py-1.5 tablet:py-2 bg-transparent pr-10 w-full outline-none placeholder:text-gray3 dark:placeholder:text-[#8C8E90] dark:text-[#8C8E90]"
                        />
                    </div>
                )}

                <NavLink
                    className="bg-primaryColor hidden text-white desktop:flex gap-2 items-center w-[130px] px-4 py-2 rounded-[8px] text-[16px]"
                    to={btnNavigate}
                >
                    <PlusIcon /> {t("create")}
                </NavLink>
            </div>
        </div>
    );
};
