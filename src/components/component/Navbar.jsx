import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavbarData } from "@/data/navbar-data";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("navbarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("navbarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div
      className={`h-screen dark:bg-darkSecondary bg-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-[80px]" : "w-[290px]"
      }`}
    >
      <div className="px-4 flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center w-full" : ""
          }`}
        >
          {!isCollapsed && (
            <p className="text-textPrimaryColor dark:text-white text-xl font-semibold">
              Sun Energy
            </p>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-textPrimaryColor dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full p-1.5 mr-2 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <div className="flex flex-col py-3 px-2 space-y-1 overflow-y-auto">
        {NavbarData.map((item) => (
          <NavLink
            key={item.id}
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-all duration-200 
              ${
                isCollapsed
                  ? "justify-center px-2 py-3"
                  : "px-4 py-2.5 space-x-3"
              } 
              ${
                isActive || pathname === item.subNav
                  ? "text-white bg-primaryColor hover:bg-primaryColor/90"
                  : "text-textPrimaryColor hover:bg-gray-100 dark:text-white dark:hover:bg-slate-700"
              }`
            }
            to={item.path}
          >
            <div
              className={`${
                isCollapsed ? "w-6 h-6" : ""
              } flex items-center justify-center relative`}
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="cursor-pointer">
                    <item.icon size={20} />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="z-50 ml-5 bg-primaryColor dark:bg-primaryColor dark:text-white">
                    <p>{t(item.title)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {!isCollapsed && <span>{t(item.title)}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
