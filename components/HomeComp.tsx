"use client";
import React, { Suspense } from "react";
import LeavesTable from "./Ag-Table/LeavesTable";

const HomeComp = () => {
  return (
    <div className="container mx-auto flex items-center justify-center flex-col">
      <LeavesTable />
    </div>
  );
};

export default HomeComp;
