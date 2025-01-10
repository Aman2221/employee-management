import React, { ReactNode } from "react";
import HomeComp from "../HomeComp";
import Nav from "../Navbar/Nav";
import { PmsProvider } from "@/context";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = ({
  children = <HomeComp />,
  showSearchInput = true,
}: {
  children?: ReactNode;
  showSearchInput?: boolean;
}) => {
  return (
    <PmsProvider>
      <div className="flex w-full">
        <Sidebar />
        <div className="w-full">
          <Nav showSearchInput={showSearchInput} />
          <div className="py-14">{children}</div>
          <Footer />
          <ToastContainer />
        </div>
      </div>
    </PmsProvider>
  );
};

export default Layout;
