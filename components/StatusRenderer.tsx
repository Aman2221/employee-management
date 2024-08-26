import { getCookie } from "@/functions";
import React, { useEffect, useState } from "react";

const StatusRenderer = ({
  data,
  openStatusUpdateModal,
}: {
  data: any;
  openStatusUpdateModal: (a: string, b: string) => void;
}) => {
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    const user = JSON.parse(getCookie("user") as any);
    if (user) setIsSuper(user?.role?.toLowerCase() !== "employee");
  }, []);

  return (
    <div>
      {isSuper ? (
        <>
          <button
            className="text-white capitalize mt-2 font-medium rounded-sm text-xs h-6 text-center inline-flex items-center w-20 flex-center"
            type="button"
            onClick={() => openStatusUpdateModal(data.status, data.id)}
          >
            <span className="text-lime-400">Approve</span>&nbsp;/&nbsp;
            <span className="text-red-400">Reject</span>
          </button>
        </>
      ) : (
        <button
          className={`${
            data.status == "rejected"
              ? "bg-red-400"
              : data.status == "pending"
              ? "bg-yellow-400"
              : "bg-green-400"
          } h-8 text-xs mt-1 text-black font-semibold rounded-lg capitalize w-20 flex-center cursor-default`}
        >
          {data.status}
        </button>
      )}
    </div>
  );
};

export default StatusRenderer;

export const CellStatusRenderer = (params: any) => {
  return (
    <>
      {params.value == "pending" ? (
        <span className="capitalize bg-yellow-400 text-black py-1 mt-2 text-xs flex-center w-16 rounded-md font-medium">
          {params.value}
        </span>
      ) : params.value == "approved" ? (
        <div className="capitalize bg-lime-400 text-black py-1 mt-2 text-xs flex-center w-16 rounded-md font-medium">
          {params.value}
        </div>
      ) : (
        <div className="capitalize bg-red-400 text-black py-1 mt-2 text-xs flex-center w-16 rounded-md font-medium">
          {params.value}
        </div>
      )}
    </>
  );
};
