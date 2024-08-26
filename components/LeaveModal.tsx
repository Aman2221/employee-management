import {
  updateSatatusAccordingDB,
  updateSatatusAccordingLocal,
} from "@/functions";
import React, { useEffect } from "react";

const LeaveModal = ({
  show,
  setShow,
  currentStatus,
  setCurrentStatus,
  storeStatusToLocal,
}: {
  show: boolean;
  setShow: (a: boolean) => void;
  currentStatus: string;
  setCurrentStatus: (a: string) => void;
  storeStatusToLocal: (a: string) => void;
}) => {
  const handleStatusUpdate = (status: string) => {
    const tempStatus = updateSatatusAccordingDB(status);
    setCurrentStatus(tempStatus);
    storeStatusToLocal(tempStatus);
    setShow(!show);
  };

  useEffect(() => {
    const tempStatus = updateSatatusAccordingLocal(currentStatus);
    setCurrentStatus(tempStatus);
  }, [show]);

  return (
    <>
      <div
        id="default-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          show ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full animate__animated animate__fadeInDown`}
      >
        <div className="relative p-4 w-96 max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Accept or Reject Leave
              </h3>
              <button
                onClick={() => setShow(!show)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="flex items-center gap-5 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              {["approve", "reject"].map((item) => (
                <button
                  key={item}
                  data-modal-hide="default-modal"
                  type="button"
                  onClick={() => handleStatusUpdate(item)}
                  className={`${
                    item == "approve" && currentStatus == "approve"
                      ? " bg-lime-500 text-white"
                      : item == "reject" && currentStatus == "reject"
                      ? `bg-red-700 text-white`
                      : `bg-gray-800 text-gray-300 ${
                          item == "approve"
                            ? "hover:bg-lime-500"
                            : "hover:bg-red-700"
                        }`
                  } hover:text-white  font-medium rounded-lg text-sm px-5 py-2.5 text-center capitalize`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveModal;
