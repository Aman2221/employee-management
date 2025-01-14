import React, { ReactNode, useState } from "react";

const DropDown = ({
  label,
  show,
  setShow,
  options = [
    "everyone",
    "business analyst",
    "graphic design",
    "frontend",
    "testing",
  ],
  SelectBtnComp,
  onChange,
  extClass = "w-full",
}: {
  label?: string;
  show: boolean;
  setShow: (a: boolean, key?: string) => void;
  options?: string[];
  SelectBtnComp: ReactNode;
  onChange: (value: string, key?: string) => void;
  extClass?: string;
}) => {
  const [activeItem, setActiveItem] = useState(options[0]);
  return (
    <div className="">
      {label ? (
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
        >
          {label}
        </label>
      ) : (
        ""
      )}
      {SelectBtnComp ? (
        SelectBtnComp
      ) : (
        <button
          id="dropdownDefaultButton"
          onClick={() => (label ? setShow(!show, label) : setShow(!show))}
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
        } bg-white divide-y divide-gray-100 rounded-lg shadow ${extClass} dark:bg-gray-700`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200 w-full"
          aria-labelledby="dropdownDefaultButton"
        >
          {options.map((item) => (
            <li
              key={item}
              className={`w-full`}
              onClick={() => {
                setActiveItem(item);
                label ? onChange(item, label) : onChange(item);
              }}
            >
              <button
                type="button"
                className={`${
                  activeItem == item ? "font-bold" : ""
                } w-full capitalize text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
              >
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
