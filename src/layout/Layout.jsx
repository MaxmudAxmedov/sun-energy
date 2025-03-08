import Navbar from "@/components/component/Navbar";

import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const isAuth = localStorage.getItem("token");

  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="grid grid-cols-mainGrid">
      <Navbar />
      <div className="bg-layoutBgColor dark:bg-darkPrimaryColor">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
