"use client";
import React, { useEffect, useState } from "react";
import AddPermission from "./AddPermission";
import PasteMessage from "./PasteMessage";
import {
  deleteAllCookies,
  exportToExcel,
  getCookie,
  getData,
} from "@/functions";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import Avatar from "./common/Avatar";
import AddUpdates from "./AddUpdates";
import NavDropdown from "./NavDropdown";
import hideOverlay from "@/HOC/hideOverlay";
import { usePmsContext } from "@/context";

const Nav = () => {
  const router = useRouter();
  const { setSearchKey } = usePmsContext();
  const [isSuper, setIsSuper] = useState(false);
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdateMdl, setShowUpdateMdl] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const NavDropdownComp = hideOverlay(NavDropdown, setShowDropdown);
  const handleExport = async () => {
    const data = await getData();
    exportToExcel(data);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    deleteAllCookies();
    router.push("/login");
  };

  const onFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setSearchKey(filterText);
    // if (gridApi) gridApi.setGridOption("quickFilterText", filterText);
  };

  useEffect(() => {
    const user = JSON.parse(getCookie("user") as any);

    if (user && user?.username) {
      setUserName(user.username);
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
  }, []);

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Primasoft
            </span>
          </a>
          <div className="flex gap-5 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
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
            </div>
            <input
              type="text"
              name="searchKey"
              id="searchKey"
              onChange={onFilterTextChange}
              className="bg-transparent outline-none border border-gray-400 rounded-lg px-3 shadow-lg w-80"
              placeholder="Search here..."
            />
            <Avatar
              name={userName}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            <NavDropdownComp
              setShow={setShowDropdown}
              show={showDropdown}
              onAddLeaveClick={() => setShow(!show)}
              onPasteClick={() => setShowMsg(!showMsg)}
              onAddUpdateClick={() => setShowUpdateMdl(!showUpdateMdl)}
              onExportDataClick={handleExport}
              handleLogout={handleLogout}
              isSuper={isSuper}
            />
          </div>
        </div>
      </nav>
      {show && <AddPermission show={show} setShow={setShow} />}
      {showMsg && <PasteMessage show={showMsg} setShow={setShowMsg} />}
      {showUpdateMdl && (
        <AddUpdates show={showUpdateMdl} setShow={setShowUpdateMdl} />
      )}
    </div>
  );
};

export default Nav;
