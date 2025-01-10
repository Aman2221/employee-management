"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { exportToExcel, getCookie, getData } from "@/functions";
import Image from "next/image";
import { usePmsContext } from "@/context";

const Sidebar = () => {
  const router = useRouter();
  const { showSidebar, setShowSidebar } = usePmsContext();
  const [isSuper, setIsSuper] = useState(false);

  const handleExport = async () => {
    const data = await getData();
    exportToExcel(data);
  };

  const superuser_options = [
    {
      name: "view updates",
      onClick: () => router.push("/view-updates"),
      svg: "/sidebar-icons/dash.svg",
    },
    {
      name: "view leaves",
      onClick: () => router.push("/view-leaves"),
      svg: "/sidebar-icons/square-box.svg",
    },

    {
      name: "register user",
      onClick: () => router.push("/register"),
      svg: "/sidebar-icons/users.svg",
    },

    {
      name: "export data",
      onClick: handleExport,
      svg: "/sidebar-icons/sign-in.svg",
    },
  ];

  const normaluser_options = [
    {
      name: "my leaves",
      onClick: () => router.push("/view-leaves"),
      svg: "/sidebar-icons/sign-in.svg",
    },
    {
      name: "my updates",
      onClick: () => router.push("/view-updates"),
      svg: "/sidebar-icons/square-box.svg",
    },
  ];

  useEffect(() => {
    const user = JSON.parse(getCookie("user") as any);
    if (user && user?.username) {
      setIsSuper(user.role.toLowerCase() !== "employee");
    }
    const getToken = getCookie("token");
    if (
      !getToken ||
      getToken === "" ||
      getToken === "undefined" ||
      getToken === null
    )
      router.push("/");
  }, [router]);

  return (
    <div className="relative">
      <aside
        id="logo-sidebar"
        className={`${
          showSidebar ? "-top-0 -left-0 relative " : "-top-0 -left-80 fixed"
        } z-40 w-64 h-screen `}
        aria-label="Sidebar"
      >
        <div className="h-full pt-6 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex border-b border-slate-600">
            <a
              href="https://flowbite.com/"
              className="flex items-center ps-2.5 mb-5"
            >
              <Image
                height={20}
                width={20}
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-6 me-3 sm:h-7"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Primasoft
              </span>
            </a>
          </div>
          <ul className="space-y-2 font-medium mt-4">
            {(isSuper ? superuser_options : normaluser_options).map((item) => (
              <li key={item.name}>
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center px-6 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Image src={item.svg} alt="name" height={20} width={20} />
                  <span className="ms-3 capitalize">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="absolute w-full left-0 bottom-0 border-t border-slate-600">
            <div className="py-2">
              <button
                onClick={() => console.log()}
                className="flex gap-3 items-center px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                <i className="bi bi-box-arrow-right text-lg font-bold"></i>
                <span className="text-base font-semibold">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
