import { user_leave_data } from "@/interfaces";
import React from "react";

const LeaveBalanceStatus = ({
  leave_balance,
  type,
  leaves,
  hideLeaveAlert,
}: {
  leave_balance: number;
  type: string;
  leaves: user_leave_data;
  hideLeaveAlert: () => void;
}) => {
  return (
    <>
      <div className="col-span-2">
        <div className="flex justify-between">
          <span className="text-sm">
            You have {leave_balance}
            {type == "permission" ? " hours " : " days "}
            {type} leave remaining
          </span>
          <button
            onClick={hideLeaveAlert}
            className="border text-xs rounded px-2 font-bold"
          >
            Ok
          </button>
        </div>
      </div>
      <div className="col-span-2"></div>
    </>
  );
};

export default LeaveBalanceStatus;
