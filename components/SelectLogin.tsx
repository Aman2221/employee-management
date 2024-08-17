"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ChooseLoginType = () => {
  const [show, setShow] = useState(false);

  const login_types = [
    {
      type: "employee",
      bg: "sky",
      route: "employee",
    },
    {
      type: "HR",
      bg: "green",
      route: "hr",
    },
    {
      type: "manager",
      bg: "red",
      route: "manager",
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
                    className="w-full"
                  >
                    <button
                      className={`bg-${item.bg}-300 capitalize hover:bg-sky-400 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center flex-center w-full gap-2`}
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
