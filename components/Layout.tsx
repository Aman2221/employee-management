import "animate.css";
import React, { ReactNode } from "react";
import HomeComp from "./HomeComp";
import Nav from "./Nav";
import { PmsProvider } from "@/context";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";

const Layout = ({ children = <HomeComp /> }: { children?: ReactNode }) => {
  return (
    <PmsProvider>
      <Nav />
      <div className="py-24">{children}</div>
      <Footer />
      <ToastContainer />
    </PmsProvider>
  );
};

export default Layout;
