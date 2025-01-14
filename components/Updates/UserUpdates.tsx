"use client";
import React, { useEffect, useState, useCallback } from "react";
import UserCard from "./UserCard";
import SearchInput from "../Common/SearchInput";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import Loader from "../Common/Loader";
import { user } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import DropDown from "../Common/DropDown";
import NoDataFound from "../Common/NoDataFound";
import hideOverlay from "@/HOC/hideOverlay";

const UpdateCard = () => {
  const [showDD, setShowDD] = useState(false);
  const [usersData, setUsersData] = useState<user[]>([]);
  const [usersDataDisplay, setUsersDataDisplay] = useState<user[]>([]);
  const [showLoader, setShowLoader] = useState(true);
  const [currentRole, setCurrentRole] = useState("everyone");
  const DropdownComp = hideOverlay(DropDown, setShowDD);

  const onRoleFilter = (selectedRole: string) => {
    setCurrentRole(selectedRole);
    if (selectedRole.toLowerCase() !== "everyone") {
      const matching = usersData.filter(
        (employee) => employee.designation.toLowerCase() == selectedRole
      );
      setUsersDataDisplay(matching);
    } else {
      setUsersDataDisplay(usersData);
    }
    setShowDD(!showDD);
  };

  const onFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let query = event.target.value.toLowerCase();
    if (query.length > 2) {
      const matching = usersData.filter(
        (employee) =>
          employee.username.toLowerCase().includes(query.toLowerCase()) ||
          employee.emp_id.toString().toLowerCase().includes(query.toLowerCase())
      );

      // Filter non-matching employees
      // const nonMatching = usersData.filter(
      //   (employee) =>
      //     !employee.username.toLowerCase().includes(query.toLowerCase())
      // );

      // Combine matching and non-matching
      // setUsersDataDisplay([...matching, ...nonMatching]);
      setUsersDataDisplay([...matching]);
    } else {
      setUsersDataDisplay([...usersData]);
    }
  };

  const getUsers = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const { password, confirm_password, ...userWithoutPassword } = data;
        return {
          id: doc.id,
          date: data.createdAt.toDate().toLocaleDateString(),
          ...userWithoutPassword,
        };
      });
      setUsersData(users as user[]);
      setUsersDataDisplay(users as user[]);
      setShowLoader(false);
    } catch (e) {
      console.error("Error fetching sorted documents: ", e);
      setShowLoader(false);
      return [];
    }
  }, []);

  useEffect(() => {
    getUsers(); //get user details from firebase
  }, [getUsers]);

  return (
    <div className="container mx-auto flex items-center justify-center flex-col ">
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <div className="updates-nav mb-10 flex justify-between items-center w-full">
            <DropDown
              onChange={onRoleFilter}
              extClass="w-max"
              SelectBtnComp={
                <button
                  onClick={() => setShowDD(!showDD)}
                  className="py-2 capitalize px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex gap-2 items-center"
                >
                  <span>{currentRole}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#fff"
                    style={{ fill: "#fff" }}
                  >
                    <path d="M7 11h10v2H7zM4 7h16v2H4zm6 8h4v2h-4z"></path>
                  </svg>
                </button>
              }
              show={showDD}
              setShow={setShowDD}
            />

            <SearchInput
              onInputChange={onFilterTextChange}
              placeHolder="Search by name or emp id"
            />
          </div>
          {usersDataDisplay && usersDataDisplay.length ? (
            <div className="grid grid-cols-4 justify-between w-full gap-6 overflow-y-scroll employee-cards-div pb-36">
              {usersDataDisplay?.map((item: user) => {
                return (
                  <AnimatePresence key={item.id}>
                    <motion.div
                      key={item.id}
                      className="employee-card"
                      layout // Enables smooth reordering animations
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <UserCard data={item} />
                    </motion.div>
                  </AnimatePresence>
                );
              })}
            </div>
          ) : (
            <NoDataFound extClss="text-4xl mt-10" />
          )}
        </>
      )}
    </div>
  );
};

export default UpdateCard;
