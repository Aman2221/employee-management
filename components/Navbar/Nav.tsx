"use client";
import React, { useEffect, useState } from "react";
import AddPermission from "../Pop-ups/AddPermission";
import PasteMessage from "../Pop-ups/PasteMessage";
import Avatar from "../Common/Avatar";
import dynamic from "next/dynamic";
import SearchInput from "../Common/SearchInput";
import Link from "next/link";
import Image from "next/image";
import hideOverlay from "@/HOC/hideOverlay";
import { usePmsContext } from "@/context";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import {
  deleteAllCookies,
  exportToExcel,
  getCookie,
  getData,
  handleCatchError,
} from "@/functions";
import { Obj, notificationsInterface } from "@/interfaces";

const AddUpdates = dynamic(() => import("../Pop-ups/AddUpdates"), {
  ssr: false,
});
const NavDropdown = dynamic(() => import("./NavDropdown"), {
  ssr: false,
});
const NavNotifications = dynamic(() => import("./NavNotifications"), {
  ssr: false,
});

const Nav = ({ showSearchInput = true }: { showSearchInput?: boolean }) => {
  const router = useRouter();
  const { setSearchKey, showSidebar, setShowSidebar } = usePmsContext();
  const [showNotice, setShowNotice] = useState(false);
  const [notiData, setNotiData] = useState<notificationsInterface[]>([]);
  const [isSuper, setIsSuper] = useState(false);
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdateMdl, setShowUpdateMdl] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const NavDropdownComp = hideOverlay(NavDropdown, setShowDropdown);
  const NavNotificationsComp = hideOverlay(NavNotifications, setShowNotice);

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

  const getNotification = async () => {
    const user = JSON.parse(getCookie("user") as string);
    try {
      const docRef = doc(db, "notifications", user.uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        let data: DocumentData = docSnapshot.data();
        const notifications = data.notifications || [];
        // Sort notifications by timestamp in descending order
        const sortedNotifications = notifications.sort(
          (a: notificationsInterface, b: notificationsInterface) => {
            return b.timestamp.toMillis() - a.timestamp.toMillis();
          }
        );
        setNotiData(sortedNotifications);
      } else {
        setTimeout(() => setNotiData([]), 500);
      }
    } catch (error) {
      handleCatchError(error);
    }
  };

  useEffect(() => {
    if (showNotice === false) setNotiData([]);
  }, [showNotice]);

  useEffect(() => {
    const getUser = getCookie("user");

    const user = JSON.parse(getUser as string);
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
  }, [router]);

  return (
    <div className="flex relative">
      <div className="flex items-center justify-center bg-gray-900 border-b pl-4 border-gray-600">
        <i
          className={`${
            showSidebar ? "bx-x" : "bx-menu-alt-left"
          } text-2xl bx  cursor-pointer`}
          onClick={() => setShowSidebar(!showSidebar)}
        ></i>
      </div>
      <nav className="bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 sticky ">
        <div className="container mx-auto flex flex-wrap items-center justify-between py-4">
          <Link href="/" className=" ">
            <Image
              priority
              src="/logo/logo.svg"
              width={200}
              height={20}
              alt="primasoft logo"
              className="dimensions-auto"
            />
          </Link>

          <div className="flex gap-5 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
            <div className="gap-5 hidden">
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
            {showSearchInput && (
              <SearchInput onInputChange={onFilterTextChange} />
            )}

            <NavNotificationsComp
              show={showNotice}
              setShow={setShowNotice}
              data={notiData}
              getNotifications={getNotification}
              setNotiData={setNotiData}
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
