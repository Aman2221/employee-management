import React from "react";
import Loader from "./Loader";
import { getCookie, markNotificationAsReadInDb } from "@/functions";

const NavNotifications = ({
  show,
  setShow,
  data,
  getNotifications,
  setNotiData,
}: {
  show: boolean;
  setShow: (a: boolean) => void;
  data: any[];
  getNotifications: () => void;
  setNotiData: (a: any) => void;
}) => {
  const hanldeNotification = () => {
    setShow(!show);
    getNotifications();
  };

  const onNotificationClick = async (
    timestamp: any,
    isAlreadyRead: boolean
  ) => {
    if (isAlreadyRead == false) {
      const user = JSON.parse(getCookie("user") as any);
      let all_data: any = data;
      const userIndex = all_data.findIndex(
        (item: any) => item.timestamp.toMillis() === timestamp.toMillis()
      );
      if (userIndex !== -1) {
        all_data[userIndex] = {
          ...all_data[userIndex], // Copy the existing user object
          read: true, // Update the status
        };
      }

      setNotiData([...all_data]);
      await markNotificationAsReadInDb(user.uid, all_data);
    }
  };

  return (
    <div className="relative">
      <div className="notifications h-full d-flex items-center justify-center ">
        <i
          className="bi bi-bell text-2xl cursor-pointer"
          onClick={hanldeNotification}
        ></i>
        {/* {data && data.filter((i) => i.read == false).length > 0 ? (
          <span
            className={`h-2 w-2 rounded-full border bg-red-400  absolute right-0 top-1`}
          ></span>
        ) : (
          <></>
        )} */}
      </div>

      <div
        className={`${
          show ? "absolute" : "hidden"
        } bg-slate-700 top-14 -left-32 w-72 rounded-lg px-3 py-4 flex gap-4 flex-col animate__animated animate__fadeIn`}
      >
        {data.length ? (
          data.map((item) => (
            <div
              key={item.timestamp.toMillis()}
              className="flex gap-3 cursor-pointer"
              onClick={() => onNotificationClick(item.timestamp, item.read)}
            >
              <div className=" h-10 w-10 rounded-full shadow bg-slate-500 flex items-center justify-center relative">
                <i className="bi bi-bell-fill text-gray-300"></i>
                {item.read === false && (
                  <span
                    className={`h-2 w-2 rounded-full border bg-red-400  absolute right-0 top-1`}
                  ></span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium capitalize">
                  Your leave for &quot;{item.message}&quot; got {item.status}
                </span>
                <span className="text-xs font-medium text-gray-300">
                  Nov 23, 2023
                </span>
              </div>
            </div>
          ))
        ) : (
          <Loader extClss="my-2" />
        )}
      </div>
    </div>
  );
};

export default NavNotifications;
