import React from "react";

type obj = { [key: string]: string };

const TableViews = ({
  views,
  activeView,
  onChange,
}: {
  views: obj[];
  activeView: string;
  onChange: (a: string) => void;
}) => {
  return (
    <div className="flex gap-4">
      {views.map((item: obj) => (
        <button
          key={item.name}
          onClick={() => onChange(item.name)}
          type="button"
          className={`${
            activeView == item.name ? "bg-gray-600" : "bg-gray-800  "
          } text-white  hover:bg-gray-600 rounded-lg text-md py-2 w-10  mb-2`}
        >
          <i className={`bi ${item.icon}`}></i>
        </button>
      ))}
    </div>
  );
};

export default TableViews;
