"use client";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import Loader from "./Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusRenderer, { CellStatusRenderer } from "./StatusRenderer";
const LeaveModal = dynamic(() => import("./LeaveModal"), {
  ssr: false,
});
import data from "@/JSON/data.json";
import {
  dynamic_column_def,
  getLeave,
  pushNotificationToDb,
  sendEmail,
  setDataToState,
  updatePermissionStatusInDB,
} from "@/functions";
import withOutsideClick from "@/HOC/closeModal";
const AddPermission = dynamic(() => import("./AddPermission"), {
  ssr: false,
});
import useSystemTheme from "@/hooks/useSystemTheme";

interface pmsInterface {
  headings: string[];
  db_data: any[];
}

const EmployeeTable = () => {
  const systemTheme = useSystemTheme();
  const { showLoader, setShowLoader, searchKey } = usePmsContext();
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentDocId, setCurrentDocId] = useState("");
  const [gridApi, setGridApi] = useState<any>(null);
  const [crrData, setCrrData] = useState<unknown>();
  const [showLeaveModel, setShowLeaveModel] = useState(false);
  const [pmsdata, setPmsData] = useState<pmsInterface>({
    headings: [],
    db_data: [],
  });
  const LeaveModalComp = withOutsideClick(LeaveModal, () =>
    setOpenLeaveModal(false)
  );

  const openStatusUpdateModal = useCallback(
    (status: string, docId: string) => {
      setOpenLeaveModal(!openLeaveModal);
      setCurrentStatus(status);
      setCurrentDocId(docId);
    },
    [openLeaveModal]
  );

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

    const html = `Hi ${all_data[userIndex].name}, Your leave for ${all_data[userIndex].reason} got ${status}`;
    sendEmail("amanshivajisingh@gmail.com", "Leaves information", html);
    const docId = all_data[userIndex].uid;
    const permission_name = all_data[userIndex].reason;
    setPmsData({
      ...pmsdata,
      db_data: [...all_data],
    });
    await updatePermissionStatusInDB(currentDocId, status); //updating status in database

    await pushNotificationToDb(docId, status, permission_name); //updating status in database
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

  const getData = useCallback(async () => {
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

    setDataToState(tempData, setShowLoader, setPmsData);
  }, [setShowLoader]);

  const onGridReady = (params: any) => {
    setGridApi(params.api); // Storing the grid API for later use
  };

  const onCellClicked = (event: any) => {
    if (event.value !== undefined) {
      setCrrData(getLeave(event.data));
      setShowLeaveModel(true);
    }
  };

  useEffect(() => {
    if (gridApi) gridApi.setGridOption("quickFilterText", searchKey);
  }, [searchKey, gridApi]);

  useEffect(() => {
    getData();
  }, [showLoader, getData]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {pmsdata.db_data.length == 0 ? (
            <div className="flex my-20 w-full justify-center items-center">
              <h1 className="md:text-4xl text-base text-center font-bold">
                No data
              </h1>
            </div>
          ) : (
            <>
              <div className="mt-6 w-full animate__animated animate__fadeIn">
                {pmsdata && pmsdata.db_data.length ? (
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div
                      className={`${
                        systemTheme == "dark"
                          ? "ag-theme-alpine-dark"
                          : "ag-theme-alpine"
                      } ag-grid-table overflow-y-scroll dm-sans rounded-sm `}
                    >
                      <AgGridReact
                        rowData={pmsdata.db_data}
                        columnDefs={columnDefs as any}
                        className="dm-sans custom-cell-border text-xs md:text-base"
                        onGridReady={onGridReady}
                        animateRows={true}
                        onCellClicked={onCellClicked}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
          <LeaveModalComp
            show={openLeaveModal}
            setShow={setOpenLeaveModal}
            currentStatus={currentStatus}
            setCurrentStatus={setCurrentStatus}
            storeStatusToLocal={storeStatusToLocal}
          />
          {showLeaveModel && (
            <AddPermission
              show={showLeaveModel}
              setShow={setShowLeaveModel}
              data={crrData as any}
            />
          )}
        </>
      )}
    </>
  );
};

export default EmployeeTable;
