import { NavbarData } from "@/data/navbar-data";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        className="flex flex-col gap-1 p-2"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span
          className="block h-[2.5px] w-6 transition-transform duration-300"
          style={{
            backgroundColor: "currentColor",
            transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
          }}
        />
        <span
          className="block h-[2.5px] w-6 transition-opacity duration-300"
          style={{
            backgroundColor: "currentColor",
            opacity: isOpen ? 0 : 1,
          }}
        />
        <span
          className="block h-[2.5px] w-6 transition-transform duration-300"
          style={{
            backgroundColor: "currentColor",
            transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      <nav
        className="fixed top-0 h-screen right-0 bg-white dark:bg-darkSecondary w-[300px] transition-transform duration-300 desktop:hidden"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex flex-col p-4 space-y-2">
          <button
            className="p-2 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span
              className="block h-[2.5px] w-5 transition-transform duration-300"
              style={{
                backgroundColor: "currentColor",
                transform: isOpen ? "translateY(-6px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-[2.5px] w-5 transition-transform duration-300"
              style={{
                backgroundColor: "currentColor",
                transform: isOpen ? "translateY(-8px) rotate(-45deg)" : "none",
              }}
            />
          </button>

          <div>
            {NavbarData.map((item) => (
              <NavLink
                key={item.id}
                onClick={() => setIsOpen(!isOpen)}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-2 py-2 gap-2 text-[18px] mt-2 font-medium transition-all duration-200 
            
              ${
                isActive || pathname === item.subNav
                  ? "text-white bg-primaryColor hover:bg-primaryColor/90"
                  : "text-textPrimaryColor hover:bg-gray-100 dark:text-white dark:border dark:border-gray-700"
              }`
                }
                to={item.path}
              >
                <item.icon />
                {t(item.title)}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};
