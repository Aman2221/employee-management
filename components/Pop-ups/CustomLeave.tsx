import React, { FormEvent, useState } from "react";
import InputField from "../Common/InputField";
import json from "@/JSON/data.json";
import { ErrorToast } from "@/functions";
import { user_leave_data } from "@/interfaces";

const CustomLeave = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (a: boolean) => void;
}) => {
  const [leaveData, setLeaveData] = useState({
    sick: null,
    casual: null,
  });

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    let target: any = e.target;
    let key: any = target.name;
    setLeaveData({
      ...leaveData,
      [key]: target.value,
    });
  };

  const handleSave = () => {
    if (leaveData.sick !== null && leaveData.casual !== null) {
      setShow(!show);
    } else {
      ErrorToast("All fields are required and should be valid");
    }
  };

  return (
    <>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`${
          show ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full animate__animated animate__fadeInDown modal-bg`}
      >
        <div className="relative w-full max-w-md max-h-full bg-gray-700 rounded-lg">
          <div className="relative  rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Custom Leave
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
          </div>
          <div className="grid p-4 grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-5">
            {json.user_leaves.map((leave) => (
              <div key={leave.name}>
                <InputField
                  name={leave.name}
                  placeholder={leave.placeholder}
                  type={leave.type}
                  label={leave.label}
                  onChange={handleInput}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end px-4 pb-4 ">
            <button
              type="button"
              onClick={handleSave}
              className="border border-blue-500 text-sm rounded-lg py-2 px-4"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomLeave;
