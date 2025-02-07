"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ReportBugToast = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/report-bug");
  };
  return (
    <div
      onClick={handleClick}
      className="bg-slate-800 py-2 px-3 rounded-l-lg fixed right-1 cursor-pointer hover:bg-slate-700 bottom-24 shadow shadow-slate-800 text-slate-400 hover:text-slate-300 flex items-center gap-2 z-10"
    >
      <i className="bi bi-bug font-bold text-xs"></i>
      <h1
        className="text-xs 
        font-semibold "
      >
        Report Bug
      </h1>
    </div>
  );
};

export default ReportBugToast;
