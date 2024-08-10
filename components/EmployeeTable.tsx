"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { permissions } from "@/interfaces";
import { usePmsContext } from "@/context";
import Loader from "./Loader";

const EmployeeTable = () => {
  const { showLoader, setShowLoader } = usePmsContext();

  const [pmsdata, setPmsData] = useState<permissions[]>([]);
  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "permissions"));
    querySnapshot.forEach((doc) => {
      setPmsData((prev) => [...prev, doc.data() as any]);
      setShowLoader(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <div className="mt-6 animate__animated animate__fadeIn">
          {pmsdata && pmsdata.length ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {Object.keys(pmsdata[0]).map((item) => (
                      <th key={item} scope="col" className="px-6 py-3">
                        {item.replace("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pmsdata.map((item) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        {Object.values(item).map((item) => (
                          <th key={item} scope="col" className="px-6 py-3">
                            {item}
                          </th>
                        ))}
                      </tr>
                    );
                  })}
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"></tr>
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default EmployeeTable;
