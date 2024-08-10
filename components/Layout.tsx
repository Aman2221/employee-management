import "animate.css";
import React, { ReactNode } from "react";
import HomeComp from "./HomeComp";
import Nav from "./Nav";
import { PmsProvider } from "@/context";

const Layout = ({ children = <HomeComp /> }: { children?: ReactNode }) => {
  return (
    <PmsProvider>
      <Nav />
      <div className="py-24">{children}</div>
    </PmsProvider>
  );
};

export default Layout;
