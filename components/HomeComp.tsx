"use client";
import React from "react";
import EmployeeTable from "./EmployeeTable";
import Footer from "./Footer";

const HomeComp = () => {
  return (
    <div className="container mx-auto flex items-center justify-center flex-col">
      <EmployeeTable />
    </div>
  );
};

export default HomeComp;
