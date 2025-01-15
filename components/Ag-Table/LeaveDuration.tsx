"use client";
import { slotType } from "@/interfaces";
import React, { useState } from "react";

type obj = { [key: string]: string };
const LeaveDuration = ({
  show,
  slotTypeData,
  handleSave,
}: {
  show: boolean;
  slotTypeData: any;
  handleSave: (a: slotType) => void;
}) => {
  const [data, setData] = useState({
    startTime: "00:00",
    endTime: "00:00",
  });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target: any = e.target;
    const key: string = target.name;
    setData({
      ...data,
      [key]: target.value,
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSave(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="dropdownTimepicker"
      className={`z-10 ${
        show ? "absolute" : "hidden"
      } bg-white rounded-lg shadow w-max dark:bg-gray-700 p-3 -top-4 ml-6 left-full`}
    >
      <div className="w-max mx-auto grid grid-cols-2 gap-4 mb-2">
        {slotTypeData.map((i: obj) => (
          <div>
            <label
              htmlFor={i.label}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {i.label}:
            </label>
            <div className="relative">
              {i.type == "time" && (
                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <input
                type={i.type}
                name={i.name}
                id={i.name}
                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={data[i.name as keyof slotType]}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end w-full">
        <button
          id="saveTimeButton"
          type="submit"
          onClick={handleSubmit}
          className="text-blue-700 dark:text-blue-500 text-sm font-semibold border rounded px-1 mt-1 border-gray-400"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default LeaveDuration;
