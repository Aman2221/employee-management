"use client";
import React, { useState } from "react";
import Avatar from "../Common/Avatar";
import { user } from "@/interfaces";
import { useRouter } from "next/navigation";
import DropDown from "../Common/DropDown";
import hideOverlay from "@/HOC/hideOverlay";
import { controleText } from "@/functions";
import CustomTooltip from "../Common/Tooltip";

const UserCard = ({ data }: { data: user }) => {
  const router = useRouter();
  const [showDD, setShowDD] = useState(false);
  const DropdownComp = hideOverlay(DropDown, setShowDD);

  const handleViewUpdates = () => {
    router.push(`/view-updates?uid=${data.uid}`);
  };

  const handleViewLeaves = () => {
    router.push(`/view-leaves?email=${data.email}`);
  };

  const handleChange = (val: string) => {
    if (val == "view profile") router.push(`/view-profile?uid=${data.uid}`);
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-end px-4 pt-2">
        <DropDown
          show={showDD}
          setShow={() => setShowDD(!showDD)}
          options={["view profile"]}
          extClass="w-max"
          SelectBtnComp={
            <button
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-700   rounded-lg text-sm p-1.5"
              type="button"
              onClick={() => setShowDD(!showDD)}
            >
              <span className="sr-only">Open dropdown</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 3"
              >
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
            </button>
          }
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col items-center pb-8">
        <div className="flex gap-6 w-full px-4">
          <Avatar
            extClass="h-20 w-20"
            name={data.username}
            fontSize="text-2xl"
            showAnimation={true}
          />
          <div>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {data.username}
            </h5>

            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {data.designation}
            </span>
            <div className="flex mt-3 ">
              <button
                onClick={handleViewUpdates}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Updates
              </button>
              <button
                onClick={handleViewLeaves}
                className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Leaves
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto  w-full mt-4 px-4">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700 ">
                <td
                  scope="row"
                  className="py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  Email
                </td>
                <th className="py-3 text-right w-full flex justify-end">
                  <CustomTooltip
                    children={<>{controleText(data.email, 20)}</>}
                    content={data.email}
                    id={data.id}
                    className=""
                  />
                </th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td
                  scope="row"
                  className="py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  Phone
                </td>
                <th className="py-3 text-right">{data.phone}</th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td
                  scope="row"
                  className="py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  Join Date
                </td>
                <th className="py-3 text-right">{data.date}</th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td
                  scope="row"
                  className="py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  EMP ID
                </td>
                <th className="py-3 text-right">{data.emp_id}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
