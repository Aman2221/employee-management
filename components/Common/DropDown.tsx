import React, { ReactNode } from "react";

const DropDown = ({
  show,
  setShow,
  options = [
    "everyone",
    "business analyst",
    "graphic desing",
    "frontend",
    "testing",
  ],
  SelectBtnComp,
  onChange,
}: {
  show: boolean;
  setShow: (a: boolean) => void;
  options?: string[];
  SelectBtnComp: ReactNode;
  onChange: (a: string) => void;
}) => {
  return (
    <div>
      {SelectBtnComp ? (
        SelectBtnComp
      ) : (
        <button
          id="dropdownDefaultButton"
          onClick={() => setShow(!show)}
          data-dropdown-toggle="dropdown"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Dropdown button
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
      )}
      <div
        id="dropdown"
        className={`z-10 absolute mt-2 ${
          show ? "flex" : "hidden"
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200 w-full"
          aria-labelledby="dropdownDefaultButton"
        >
          {options.map((item) => (
            <li key={item} className="w-full" onClick={() => onChange(item)}>
              <button className="w-full capitalize  text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
