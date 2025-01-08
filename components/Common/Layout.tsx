import React, { ReactNode } from "react";
import HomeComp from "../HomeComp";
import Nav from "../Navbar/Nav";
import { PmsProvider } from "@/context";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";

const Layout = ({
  children = <HomeComp />,
  showSearchInput = true,
}: {
  children?: ReactNode;
  showSearchInput?: boolean;
}) => {
  return (
    <PmsProvider>
      <Nav showSearchInput={showSearchInput} />
      <div className="py-24">{children}</div>
      <Footer />
      <ToastContainer />
    </PmsProvider>
  );
};

export default Layout;
