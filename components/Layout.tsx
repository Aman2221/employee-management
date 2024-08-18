import "animate.css";
import React, { ReactNode } from "react";
import HomeComp from "./HomeComp";
import Nav from "./Nav";
import { PmsProvider } from "@/context";
import { ToastContainer } from "react-toastify";

const Layout = ({ children = <HomeComp /> }: { children?: ReactNode }) => {
  return (
    <PmsProvider>
      <Nav />
      <div className="py-24">{children}</div>
      <ToastContainer />
    </PmsProvider>
  );
};

export default Layout;
