"use client";
import React, { useEffect, useState } from "react";
import json from "@/JSON/data.json";
import { holiday } from "@/interfaces";

const UpcomingLeavsComp = () => {
  const [data, setData] = useState<holiday[]>();

  const getUpcomingHolidays = () => {
    const currentDate = new Date();

    const upcomingHolidays = json.holidays
      .map((holiday) => {
        if (Array.isArray(holiday.dates)) {
          const futureDates = holiday.dates.filter(
            (entry) => new Date(entry.date) > currentDate
          );
          return futureDates.length ? { ...holiday, dates: futureDates } : null;
        }
        return new Date(holiday.date as string) > currentDate ? holiday : null;
      })
      .filter(Boolean); // Remove null values

    setData(upcomingHolidays as any);
  };

  useEffect(() => {
    getUpcomingHolidays();
  }, []);

  return (
    <div className="container mx-auto ">
      <h1 className="text-4xl font-bold text-center text-gray-200">
        Upcoming Holidays
      </h1>
      <h4 className="text-base text-gray-300 font-medium text-center my-2">
        Plan Ahead for the Special Days Coming Your Way!
      </h4>
      <table className="mt-10 w-full text-sm text-left rtl:text-right text-gray-500 rounded-t-lg dark:text-gray-100">
        <thead className="text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
          <tr>
            <th scope="col" className="p-4 text-base ">
              Holiday Name
            </th>
            <th scope="col" className="p-4 text-base ">
              Date(s)
            </th>
            <th scope="col" className="p-4 text-base ">
              Day(s)
            </th>
            <th scope="col" className="p-4 text-base ">
              Double Pay
            </th>
          </tr>
        </thead>
        <tbody className=" rounded">
          {data &&
            data.map((holiday) => (
              <tr
                key={holiday.slNo}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 "
              >
                <td className="px-6 py-4  text-base font-medium">
                  {holiday.holidayName}
                </td>
                <td className="px-6 py-4  text-base font-medium">
                  {holiday.date
                    ? holiday.date
                    : holiday.dates?.map((d, index) => (
                        <span key={index}>
                          {d.date}
                          {index < holiday.dates.length - 1 && ", "}
                        </span>
                      ))}
                </td>
                <td className="px-6 py-4 text-base font-medium">
                  {holiday.day
                    ? holiday.day
                    : holiday.dates?.map((d, index) => (
                        <span key={index}>
                          {d.day}
                          {index < holiday.dates.length - 1 && ", "}
                        </span>
                      ))}
                </td>
                <td className="px-6 py-4 text-base font-medium">
                  {holiday.doublePay ? "Yes" : "No"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingLeavsComp;
