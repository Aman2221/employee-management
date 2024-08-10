import { permissions } from "@/interfaces";
import React, { useState } from "react";

const EmplyeeSearch = ({
  handleSearch,
  handleCategory,
  handleInputChange,
  searchFilter,
}: {
  handleSearch: (e: React.FormEvent) => void;
  handleCategory: (a: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchFilter: { [key: string]: string };
}) => {
  const leave_types = ["4 hours", "casual", "sick"];
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <div className="flex justify-end w-full">
      <form className="w-96 mx-auto" onSubmit={handleSearch}>
        <div className="flex relative">
          <label
            htmlFor="search-dropdown"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Your Email
          </label>
          <button
            onClick={() => setShowDropDown(!showDropDown)}
            id="dropdown-button"
            data-dropdown-toggle="dropdown"
            className="w-24 capitalize flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg y-200  dark:bg-gray-700  dark:text-white dark:border-gray-600"
            type="button"
          >
            {searchFilter.type}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdown"
            className={`${
              showDropDown ? "flex" : "hidden"
            } animate__animated animate__fadeIn absolute top-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-24 dark:bg-gray-700`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              {leave_types.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleCategory(item)}
                    type="button"
                    className="capitalize inline-flex w-full px-4 py-2"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-full">
            <input
              onChange={handleInputChange}
              minLength={3}
              type="search"
              id="search-dropdown"
              className="block outline-none p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300   dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
              placeholder="Name or Empolyee ID"
              required
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 "
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const TableDataRows = ({
  data,
  headings,
}: {
  data: any;
  headings: string[];
}) => {
  return data.map((row: any, i: number) => (
    <tr
      key={i}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      {headings.map((item: string) => (
        <th key={item} scope="col" className="px-6 py-3">
          {row[item as any]}
        </th>
      ))}
    </tr>
  ));
};
export default EmplyeeSearch;
