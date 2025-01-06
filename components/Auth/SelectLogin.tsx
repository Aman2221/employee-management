"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ChooseLoginType = () => {
  const [show, setShow] = useState(false);

  const login_types = [
    {
      type: "employee",
      bg: "bg-green",
      route: "employee",
      hover: "hover:bg-green-400",
    },
    {
      type: "HR",
      bg: "bg-red",
      route: "hr",
      hover: "hover:bg-red-400",
    },
    {
      type: "manager",
      bg: "bg-yellow",
      route: "manager",
      hover: "hover:bg-yellow-400",
    },
  ];

  useEffect(() => {
    setTimeout(() => setShow(true), 500);
  }, []);

  return (
    <div className="">
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          show ? "flex opacity-100" : "opacity-0"
        } transition-opacity overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="px-4 py-6 rounded-lg dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">
                Select login type
              </h3>
              <div className="flex-col-center gap-5">
                {login_types.map((item) => (
                  <Link
                    key={item.type}
                    href={"/login/" + item.route}
                    className={`w-full ${item.bg}-300 ${item.hover}`}
                  >
                    <button
                      className={` capitalize text-gray-800 font-medium py-2 px-4 rounded w-full`}
                    >
                      {item.type} Login
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseLoginType;
