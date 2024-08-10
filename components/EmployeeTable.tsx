"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import Loader from "./Loader";
import EmplyeeSearch, { TableDataRows } from "./EmplyeeSearch";
import { removeKeyFromArray } from "@/functions";
import { permissions } from "@/interfaces";

interface pmsInterface {
  headings: string[];
  db_data: string[];
  filter_data: string[];
}
const EmployeeTable = () => {
  const { showLoader, setShowLoader, callGetData } = usePmsContext();
  const [searchFilter, setSearchFilter] = useState({
    type: "type",
    searchKey: "",
  });
  const [pmsdata, setPmsData] = useState<pmsInterface>({
    headings: [],
    db_data: [],
    filter_data: [],
  });

  const handleCategory = (type: string) => {
    setSearchFilter({ ...searchFilter, type: type });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: any = e.target.value;

    if (value.length > 3) {
      setSearchFilter({
        ...searchFilter,
        searchKey: value.toLowerCase(),
      });
    } else {
      setPmsData({
        ...pmsdata,
        filter_data: [],
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFilter.searchKey) {
      const temp_data = pmsdata.db_data.filter((i: any) =>
        i.name.toLowerCase().includes(searchFilter.searchKey)
      );
      setPmsData({
        ...pmsdata,
        filter_data: temp_data,
      });
    }
  };

  const getData = async () => {
    const tempData: any = [];
    try {
      const q = query(
        collection(db, "permissions"),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map((doc) =>
        tempData.push({
          id: doc.id,
          ...doc.data(),
        })
      );
    } catch (e) {
      console.error("Error fetching sorted documents: ", e);
      return [];
    }

    setTimeout(() => {
      const updatedUsers = removeKeyFromArray(tempData, "created_at");
      if (tempData.length) {
        setPmsData({
          ...pmsdata,
          headings: Object.keys(updatedUsers[0]) as string[],
          db_data: updatedUsers,
        });
      }
      setShowLoader(false);
    }, 2000);
  };

  useEffect(() => {
    getData();
  }, [callGetData]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {pmsdata.db_data.length == 0 ? (
            <div className="flex my-10 w-full justify-center items-center">
              <h1 className="text-4xl text-center font-bold">No data</h1>
            </div>
          ) : (
            <>
              <EmplyeeSearch
                handleCategory={handleCategory}
                handleSearch={handleSearch}
                handleInputChange={handleInputChange}
                searchFilter={searchFilter}
              />
              <div className="mt-6 animate__animated animate__fadeIn">
                {pmsdata && pmsdata.db_data.length ? (
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          {pmsdata.headings.map((item: string) => (
                            <th
                              key={item}
                              scope="col"
                              className={`${
                                item == "id" ? "hidden" : ""
                              } px-6 py-3`}
                            >
                              {item.replace("_", " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <TableDataRows
                          data={
                            pmsdata.filter_data.length
                              ? pmsdata.filter_data
                              : pmsdata.db_data
                          }
                          headings={pmsdata.headings}
                        />
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default EmployeeTable;
