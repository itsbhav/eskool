import React from "react";
import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";
const Layout = () => {
  return (
    <>
      <DashHeader />
      <Outlet />
      <DashFooter />
    </>
  );
};

export default Layout;
