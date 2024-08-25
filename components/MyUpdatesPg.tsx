"use client";
import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import Loader from "./Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import data from "@/JSON/data.json";
import { getCookie, setDataToState } from "@/functions";

interface pmsInterface {
  headings: string[];
  db_data: any[];
}
const MyUpdatesPg = () => {
  const user = JSON.parse(getCookie("user") as any);
  const { showLoader, setShowLoader } = usePmsContext();
  const [updatesdata, setUpdatesData] = useState<pmsInterface>({
    headings: [],
    db_data: [],
  });

  const columnDefs = useMemo(
    () => data.update_column_defs,
    [updatesdata.db_data]
  );

  const getCurrentUserUpdates = async () => {
    const tempData: any = [];
    try {
      const userCollection = collection(db, "updates"); // Replace 'yourCollection' with your collection name
      const userQuery = query(userCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        let userData;
        querySnapshot.forEach((doc) => {
          tempData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setDataToState(tempData, setShowLoader, setUpdatesData);
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  const getAllUpdatesData = async () => {
    const tempData: any = [];
    try {
      const q = query(collection(db, "updates"), orderBy("created_at", "desc"));
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

    setDataToState(tempData, setShowLoader, setUpdatesData);
  };

  useEffect(() => {
    if (user && user.role.toLowerCase() !== "employee") getAllUpdatesData();
    else getCurrentUserUpdates();
  }, [showLoader]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {updatesdata.db_data.length == 0 ? (
            <div className="flex my-10 w-full justify-center items-center">
              <h1 className="text-4xl text-center font-bold">No data</h1>
            </div>
          ) : (
            <>
              <div className="mt-6 w-full animate__animated animate__fadeIn container mx-auto">
                {updatesdata && updatesdata.db_data.length ? (
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="ag-theme-alpine-dark ag-grid-table overflow-y-scroll dm-sans rounded-sm">
                      <AgGridReact
                        rowData={updatesdata.db_data}
                        columnDefs={columnDefs as any}
                        className="dm-sans custom-cell-border"
                      />
                    </div>
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

export default MyUpdatesPg;
