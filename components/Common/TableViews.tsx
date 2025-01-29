import { Obj } from "@/interfaces";
import React from "react";

const TableViews = ({
  views,
  activeView,
  onChange,
}: {
  views: Obj[];
  activeView: string;
  onChange: (a: string) => void;
}) => {
  return (
    <div className="flex gap-4">
      {views.map((item: Obj) => (
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
