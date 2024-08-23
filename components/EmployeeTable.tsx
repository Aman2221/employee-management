"use client";
import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import Loader from "./Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusRenderer, { CellStatusRenderer } from "./StatusRenderer";
import LeaveModal from "./LeaveModal";
import data from "@/JSON/data.json";
import { dynamic_column_def, updatePermissionStatusInDB } from "@/functions";

interface pmsInterface {
  headings: string[];
  db_data: any[];
}
const EmployeeTable = () => {
  const { showLoader, setShowLoader, callGetData } = usePmsContext();
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentDocId, setCurrentDocId] = useState("");
  const [pmsdata, setPmsData] = useState<pmsInterface>({
    headings: [],
    db_data: [],
  });

  const openStatusUpdateModal = (status: string, docId: string) => {
    setOpenLeaveModal(!openLeaveModal);
    setCurrentStatus(status);
    setCurrentDocId(docId);
  };

  const storeStatusToLocal = async (status: string) => {
    let all_data: any = pmsdata.db_data;

    const userIndex = all_data.findIndex(
      (user: any) => user.id === currentDocId
    );
    if (userIndex !== -1) {
      all_data[userIndex] = {
        ...all_data[userIndex], // Copy the existing user object
        status: status, // Update the status
      };
    }
    setPmsData({
      ...pmsdata,
      db_data: [...all_data],
    });
    await updatePermissionStatusInDB(currentDocId, status); //updating status in database
  };

  const columnDefs = useMemo(() => {
    const dynamic_defs = dynamic_column_def(
      StatusRenderer,
      CellStatusRenderer,
      pmsdata.db_data,
      openStatusUpdateModal
    );
    if (dynamic_defs) return [...data.column_defs, ...dynamic_defs];
    else return [...data.column_defs];
  }, [openStatusUpdateModal, pmsdata.db_data]);

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
      if (tempData.length) {
        setPmsData({
          headings: Object.keys(tempData[0]) as string[],
          db_data: tempData,
        });
      }
      setShowLoader(false);
    }, 3000);
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
              <div className="mt-6 w-full animate__animated animate__fadeIn">
                {pmsdata && pmsdata.db_data.length ? (
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="ag-theme-alpine-dark ag-grid-table overflow-y-scroll dm-sans rounded-sm">
                      <AgGridReact
                        rowData={pmsdata.db_data}
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
          <LeaveModal
            show={openLeaveModal}
            setShow={setOpenLeaveModal}
            currentStatus={currentStatus}
            setCurrentStatus={setCurrentStatus}
            storeStatusToLocal={storeStatusToLocal}
          />
        </>
      )}
    </>
  );
};

export default EmployeeTable;
