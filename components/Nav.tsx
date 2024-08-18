"use client";
import React, { useEffect, useState } from "react";
import AddPermission from "./AddPermission";
import PasteMessage from "./PasteMessage";
import { exportToExcel, getData } from "@/functions";

const Nav = () => {
  const [isSuper, setIsSuper] = useState(false);

  const [show, setShow] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const handleExport = async () => {
    const data = await getData();
    exportToExcel(data);
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Primasoft
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="flex gap-5">
              <div className="flex md:hidden items-center gap-2">
                <i
                  onClick={() => setShow(!show)}
                  className="bx bxs-file-plus text-lg font-bold cursor-pointer"
                ></i>
                <i
                  onClick={() => setShowMsg(!show)}
                  className="bx bx-paste text-lg font-bold cursor-pointer"
                ></i>
                <i
                  onClick={handleExport}
                  className="bx bx-table text-lg font-bold cursor-pointer"
                ></i>
              </div>
              <div className="md:flex hidden gap-4">
                <button
                  onClick={() => setShow(!show)}
                  type="button"
                  className="text-white uppercase  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  New Record
                </button>
                <button
                  onClick={() => setShowMsg(!show)}
                  type="button"
                  className="text-white uppercase  bg-lime-700 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
                >
                  Paste message
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="text-white uppercase  bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Export data
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {show && <AddPermission show={show} setShow={setShow} />}
      {showMsg && <PasteMessage show={showMsg} setShow={setShowMsg} />}
    </div>
  );
};

export default Nav;
