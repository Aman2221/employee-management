"use client";
import React, { useState, useEffect } from "react";
import Avatar from "../Common/Avatar";
import { ErrorToast, getCookie } from "@/functions";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { user, userKeys } from "@/interfaces";

const UserProfile = () => {
  const user = JSON.parse(getCookie("user") as string);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.size ? searchParams.get("uid") : user?.uid;
  const [showLoader, setShowLoader] = useState(true);
  const [userData, setUserData] = useState<user>();

  const getCurrentUserData = async () => {
    try {
      const userDocRef = doc(db, "users", searchQuery as string);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const date = new Date(
          userDocSnap.data().createdAt.seconds * 1000
        ).toLocaleDateString();
        let { password, confirm_password, createdAt, ...filtered } =
          userDocSnap.data();
        let data = {
          date: date,
          ...filtered,
        };
        setUserData(data as user);
        setShowLoader(!showLoader);
      } else {
        setShowLoader(!showLoader);
      }
    } catch (e) {
      ErrorToast("Can't get this user data");
      setShowLoader(!showLoader);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      getCurrentUserData();
    }
  }, []);

  return userData && showLoader == false ? (
    <div className="py-10 w-full container mx-auto flex gap-4">
      <div className="w-96 bg-slate-900 h-max min-h-max rounded-md p-8 shadow-lg">
        <div className="w-full border-b border-gray-600 pb-2">
          <span className="text-2xl font-medium">Profile picture</span>
        </div>
        <div className="mt-5 flex-center flex-col">
          <Avatar
            name={userData?.username}
            extClass="h-32 w-32"
            fontSize="text-4xl"
          />
          {userData?.leaves && (
            <div className="flex flex-col mt-5 gap-4">
              <span className="bg-none bg-transparent text-gray-200 font-medium capitalize text-sm poppins">
                Sick Leave : {userData?.leaves.sick}
              </span>
              <span className="bg-none bg-transparent text-gray-200 font-medium capitalize text-sm poppins">
                Casual Leave : {userData?.leaves.casual}
              </span>
            </div>
          )}
        </div>
      </div>
      <form className="w-full bg-slate-900 flex flex-col rounded-md p-8 shadow-lg">
        <div className="w-full border-b border-gray-600 pb-2">
          <span className="text-2xl font-medium">User information</span>
        </div>
        <div className="w-full  grid grid-cols-2 mt-5 gap-y-10">
          {Object.keys(userData)
            .filter((i) => i !== "leaves")
            .sort()
            .map((item) => (
              <div className="flex flex-col" key={userData[item as userKeys]}>
                <label
                  className="text-sm font-semibold uppercase poppins text-gray-400"
                  htmlFor=""
                >
                  {item == "createdAt"
                    ? "joining date"
                    : item.replace("_", " ")}
                </label>
                <input
                  type="text"
                  className="bg-none bg-transparent font-bold capitalize text-2xl poppins"
                  value={
                    item == "createdAt"
                      ? userData.date
                      : userData[item as userKeys]
                  }
                />
              </div>
            ))}
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
};

export default UserProfile;
