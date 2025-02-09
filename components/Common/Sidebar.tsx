"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePmsContext } from "@/context";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  deleteAllCookies,
  exportToExcel,
  getCookie,
  getData,
} from "@/functions";
import {
  default_employee_opts,
  default_superuser_opts,
} from "../../DefaultData";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activePath = pathname.replace("/", "");
  const { showSidebar, setShowSidebar } = usePmsContext();
  const [isSuper, setIsSuper] = useState(false);
  const [currPath, setCurrPath] = useState("");

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    deleteAllCookies();
    router.push("/login");
  };

  const handleExport = async () => {
    const data = await getData();
    exportToExcel(data);
  };

  const superuser_options = default_superuser_opts(router, handleExport);

  const normaluser_options = default_employee_opts(router);

  useEffect(() => {
    const getUser = getCookie("user");
    if (getUser) {
      let user = JSON.parse(getUser as string);
      if (user && user?.username) {
        setIsSuper(user.role.toLowerCase() !== "employee");
      }
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
        <div className="h-full pt-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex border-b border-slate-600">
            <Link href="/" className="pb-4 pl-2 ">
              <Image
                priority
                src="/logo/logo.png"
                width={180}
                height={20}
                alt="primasoft logo"
              />
            </Link>
          </div>
          <ul className="space-y-2 font-medium mt-4">
            {(isSuper ? superuser_options : normaluser_options).map((item) => (
              <li key={item.name} onClick={() => setCurrPath(item.name)}>
                {item.name == "export data" ? (
                  <button
                    onClick={item.onClick}
                    className={`${
                      activePath == item.path ? "bg-gray-700" : ""
                    } w-full flex items-center px-6 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                  >
                    <Image src={item.svg} alt="name" height={20} width={20} />
                    <span className="ms-3 capitalize">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={"/" + item.path}
                    className={`${
                      activePath == item.path ? "bg-gray-700" : ""
                    } w-full flex items-center px-6 py-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                  >
                    <Image src={item.svg} alt="name" height={20} width={20} />
                    <span className="ms-3 capitalize">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="absolute w-full left-0 bottom-0 border-t border-slate-600">
            <div className="py-2">
              <button
                onClick={handleLogout}
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
