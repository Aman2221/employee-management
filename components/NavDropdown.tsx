import { getCookie } from "@/functions";
import { useRouter } from "next/navigation";
import React from "react";

const NavDropdown = ({
  show,
  isSuper,
  setShow,
  onAddLeaveClick,
  onPasteClick,
  onAddUpdateClick,
  onExportDataClick,
  handleLogout,
}: {
  show: boolean;
  isSuper: boolean;
  setShow: (a: boolean) => void;
  onAddLeaveClick: () => void;
  onPasteClick: () => void;
  onAddUpdateClick: () => void;
  onExportDataClick: () => void;
  handleLogout: () => void;
}) => {
  const router = useRouter();
  const userUid = JSON.parse(getCookie("user") as string);
  const superuser_options = [
    { name: "add leave", onClick: onAddLeaveClick, icon: "bi-patch-plus" },
    {
      name: "paste message",
      onClick: onPasteClick,
      icon: "bi-clipboard-check",
    },
    { name: "add update", onClick: onAddUpdateClick, icon: "bi-list-ul" },
    { name: "export data", onClick: onExportDataClick, icon: "bi-escape" },
    {
      name: "view leaves",
      onClick: () => router.push("/view-updates"),
      icon: "bi-eye",
    },
  ];

  const normaluser_options = [
    { name: "add leave", onClick: onAddLeaveClick, icon: "bi-patch-plus" },
    { name: "add update", onClick: onAddUpdateClick, icon: "bi-list-ul" },
    {
      name: "my updates",
      onClick: () => router.push("/view-updates"),
      icon: "bi-eye",
    },
  ];

  const handleClick = (callback: () => void) => {
    callback();
    setShow(!show);
  };

  return (
    <div className="relative">
      <div
        id="dropdownDelay"
        className={`${
          show ? "block" : "hidden"
        } z-10 absolute top-16 -left-32  animate__animated animate__fadeIn bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div className="flex gap-2 items-center">
            <i className="bi bi-person text-lg font-bold"></i>
            <span className="text-lg font-bold">{userUid.username}</span>
          </div>
          <div className="flex gap-2 items-center">
            <i className="bi bi-envelope text-sm font-bold"></i>
            <span className="font-medium truncate">{userUid.email}</span>
          </div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDelayButton"
        >
          {isSuper
            ? superuser_options.map((item) => (
                <li key={item.name} onClick={() => handleClick(item.onClick)}>
                  <button className="block w-full text-left capitalize px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <i className={`bi ${item.icon} text-sm font-bold`}></i>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))
            : normaluser_options.map((item) => (
                <li key={item.name} onClick={() => handleClick(item.onClick)}>
                  <button className="flex gap-2 w-full text-left capitalize px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    <i className={`bi ${item.icon} text-sm font-bold`}></i>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
        </ul>
        <div className="py-2">
          <button
            onClick={handleLogout}
            className="flex gap-2 items-center px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            <i className="bi bi-box-arrow-right text-md font-bold"></i>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;
