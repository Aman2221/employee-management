"use client";
import { getCookie } from "@/functions";
import React, { useEffect } from "react";
import Avatar from "./common/Avatar";

const UserProfile = () => {
  const user = JSON.parse(getCookie("user") as any);

  return (
    <div className="py-20 w-full container mx-auto flex gap-4">
      <div className="w-96 bg-slate-700 h-max min-h-max rounded-md p-8">
        <div className="w-full border-b border-gray-600 pb-2">
          <span className="text-2xl font-medium">Profile picture</span>
        </div>
        <div className="mt-5 flex-center flex-col">
          <Avatar
            name={user.username}
            extClass="h-32 w-32"
            fontSize="text-4xl"
          />
          <div className="grid grid-cols-2 mt-5 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <span className="text-sm font-semibold capitalize poppins text-gray-400">
                  status
                </span>
                <span className="bg-none bg-transparent text-gray-200 font-medium capitalize text-sm poppins">
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <form className="w-full bg-slate-700 flex flex-col rounded-md p-8">
        <div className="w-full border-b border-gray-600 pb-2">
          <span className="text-2xl font-medium">User information</span>
        </div>
        <div className="w-full  grid grid-cols-2 mt-5 gap-y-10">
          {Object.keys(user).map((item) => (
            <div className="flex flex-col" key={user[item]}>
              <label
                className="text-sm font-semibold uppercase poppins text-gray-400"
                htmlFor=""
              >
                {item == "createdAt" ? "joining date" : item.replace("_", " ")}
              </label>
              <input
                type="text"
                className="bg-none bg-transparent font-bold capitalize text-2xl poppins"
                value={
                  item == "createdAt"
                    ? new Date(user[item].seconds * 1000).toLocaleDateString()
                    : user[item]
                }
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
