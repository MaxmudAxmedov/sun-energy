import { BurgerMenu } from "@/components/component/Burger-Menu";
import Navbar from "@/components/component/Navbar";
import { getState } from "@/lib/storage";
import { useLocation } from "react-router-dom";

import { Navigate, Outlet } from "react-router-dom";
import LogoMobile from "@/assets/imgs/logo-img.jpg";

export default function Layout() {
  const isAuth = getState("authToken");
  const { pathname } = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex">
      <Navbar />
      <div className="bg-layoutBgColor pb-4 w-full dark:bg-darkPrimaryColor">
        <div className="desktop:container mx-[20px]">
          <span
            className={
              pathname === "/createProduct"
                ? "hidden"
                : "flex desktop:hidden items-center justify-between mt-2 mb-3"
            }
          >
            <img
              className="w-[70px] h-[40px] rounded-md"
              src={LogoMobile}
              alt=""
            />
            <BurgerMenu />
          </span>
          <div className="desktop:ml-[300px] min-h-[95vh]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
