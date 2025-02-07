"use client";
import React, { useEffect, useState } from "react";
import json from "@/JSON/data.json";
import { Obj, slotType } from "@/interfaces";

const LeaveDuration = ({
  show,
  handleSave,
  type,
  duration,
}: {
  show: boolean;
  handleSave: (a: slotType) => void;
  type: string;
  duration: number;
}) => {
  const hours = String(new Date().getHours()).padStart(2, "0");
  const minutes = String(new Date().getMinutes()).padStart(2, "0");
  const twoHoursLater = new Date(
    new Date().getTime() + duration * 60 * 60 * 1000
  ); // Add 2 hours in milliseconds
  const endHours = String(twoHoursLater.getHours()).padStart(2, "0");
  const endMinutes = String(twoHoursLater.getMinutes()).padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;
  const endTime = `${endHours}:${endMinutes}`;
  const duration24x = 24 * duration;

  const slotTypeData = type == "permission" ? json.timeSlot : json.dateSlot;
  const keyData =
    type == "permission"
      ? {
          start_time: currentTime,
          end_time: endTime,
        }
      : {
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(
            new Date().getTime() + duration24x * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        };

  const [data, setData] = useState(keyData);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const key: string = target.name;
    setData({
      ...data,
      [key]: target.value,
    });
  };

  const handleSubmit = () => {
    handleSave(data);
  };

  useEffect(() => {
    setData(keyData);
  }, [type]);

  return (
    <div
      id="dropdownTimepicker"
      className={`z-10 ${
        show ? "absolute" : "hidden"
      } bg-white rounded-lg shadow w-max dark:bg-gray-700 p-3 -top-4 ml-6 left-full`}
    >
      <div className="w-max mx-auto grid grid-cols-2 gap-4 mb-2">
        {slotTypeData.map((i: Obj) => (
          <div key={i.label}>
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
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                      clipRule="evenodd"
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
                defaultValue={data[i.name as keyof slotType]}
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
          type="button"
          onClick={handleSubmit}
          className="text-blue-700 dark:text-blue-500 text-sm font-semibold border rounded px-1 mt-1 border-gray-400"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LeaveDuration;
