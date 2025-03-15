import { BurgerMenu } from "@/components/component/Burger-Menu";
import Navbar from "@/components/component/Navbar";
import { useLocation } from "react-router-dom";

import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const isAuth = localStorage.getItem("token");
  const { pathname } = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex">
      <Navbar />
      <div className="bg-layoutBgColor h-screen w-full dark:bg-darkPrimaryColor">
        <div className="desktop:container mx-[20px]">
          <span className={pathname === "/createProduct" ? "hidden" : "flex desktop:hidden items-center justify-between mt-1 mb-3"}>
            <p>icon</p>
            <BurgerMenu />
          </span>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
