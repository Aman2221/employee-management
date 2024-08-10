import React from "react";
import { TableDataRows } from "./EmplyeeSearch";
import { permissions } from "@/interfaces";

const TailwindTable = ({
  pmsdata,
}: {
  pmsdata: {
    headings: string[];
    db_data: permissions[];
    filter_data: permissions[];
  };
}) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {pmsdata.headings.map((item: string) => (
            <th
              key={item}
              scope="col"
              className={`${item == "id" ? "hidden" : ""} px-6 py-3`}
            >
              {item.replace("_", " ")}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="h-36 max-h-24 border border-red-500">
        <TableDataRows
          data={
            pmsdata.filter_data.length ? pmsdata.filter_data : pmsdata.db_data
          }
          headings={pmsdata.headings}
        />
      </tbody>
    </table>
  );
};

export default TailwindTable;
