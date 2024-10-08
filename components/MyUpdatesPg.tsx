"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import Loader from "./Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import data from "@/JSON/data.json";
import { getCookie, getUpdate, setDataToState } from "@/functions";
const AddUpdates = dynamic(() => import("./AddUpdates"), {
  ssr: false,
});
import useSystemTheme from "@/hooks/useSystemTheme";
import dynamic from "next/dynamic";

interface pmsInterface {
  headings: string[];
  db_data: any[];
}
const MyUpdatesPg = () => {
  const systemTheme = useSystemTheme();
  const user = JSON.parse(getCookie("user") as any);
  const { showLoader, setShowLoader, searchKey } = usePmsContext();
  const [showUpdateMdl, setShowUpdateMdl] = useState(false);
  const [gridApi, setGridApi] = useState<any>(null);
  const [crrData, setCrrData] = useState<unknown>();
  const [updatesdata, setUpdatesData] = useState<pmsInterface>({
    headings: [],
    db_data: [],
  });

  const columnDefs = useMemo(() => data.update_column_defs, []);

  const onGridReady = (params: any) => {
    setGridApi(params.api); // Storing the grid API for later use
  };

  const onCellClicked = (event: any) => {
    setCrrData(getUpdate(event.data));
    setShowUpdateMdl(true);
  };

  const getCurrentUserUpdates = useCallback(async () => {
    const tempData: any = [];
    try {
      const userCollection = collection(db, "updates"); // Replace 'yourCollection' with your collection name
      const userQuery = query(userCollection, where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
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
  }, [setShowLoader, user?.uid]);

  const getAllUpdatesData = useCallback(async () => {
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
  }, [setShowLoader]);

  useEffect(() => {
    if (gridApi) gridApi.setGridOption("quickFilterText", searchKey);
  }, [searchKey, gridApi]);

  useEffect(() => {
    if (user && user?.role?.toLowerCase() !== "employee") getAllUpdatesData();
    else getCurrentUserUpdates();
  }, [showLoader, getAllUpdatesData, getCurrentUserUpdates, user]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {updatesdata.db_data.length == 0 ? (
            <div className="flex my-20 w-full justify-center items-center">
              <h1 className="md:text-4xl text-base text-center font-bold">
                No data available
              </h1>
            </div>
          ) : (
            <>
              <div className="mt-6 w-full animate__animated animate__fadeIn container mx-auto">
                {updatesdata && updatesdata.db_data.length ? (
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div
                      className={`${
                        systemTheme == "dark"
                          ? "ag-theme-alpine-dark"
                          : "ag-theme-alpine"
                      } ag-grid-table overflow-y-scroll dm-sans rounded-sm`}
                    >
                      <AgGridReact
                        rowData={updatesdata.db_data}
                        columnDefs={columnDefs as any}
                        className="dm-sans custom-cell-border"
                        onCellClicked={onCellClicked}
                        onGridReady={onGridReady}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {showUpdateMdl && (
                <AddUpdates
                  show={showUpdateMdl}
                  setShow={setShowUpdateMdl}
                  data={crrData as any}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default MyUpdatesPg;
