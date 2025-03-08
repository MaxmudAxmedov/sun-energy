import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavbarData } from "@/data/navbar-data";

import { useLocation } from "react-router-dom";

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <div className="h-screen dark:bg-darkSecondary bg-white flex flex-col">
      <div className="px-7">
        <p className="text-textPrimaryColor dark:text-white text-[22px] font-semibold">
          Sun Energy
        </p>
      </div>
      <div className="flex flex-col  items-left py-3 px-7 h-screen space-y-1">
        {NavbarData.map((item) => (
          <NavLink
            key={item.id}
            className={({ isActive }) =>
              `flex items-center rounded-[6px] space-x-2 text-lg font-medium px-4 py-2 transition-all duration-200 ${
                isActive || pathname === item.subNav
                  ? "text-white bg-primaryColor   font-semibold"
                  : "text-textPrimaryColor dark:hover:bg-slate-700 hover:bg-gray-200 dark:text-white"
              }`
            }
            to={item.path}
          >
            <item.icon />
            <p>{t(item.title)}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
