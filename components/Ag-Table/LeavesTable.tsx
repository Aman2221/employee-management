"use client";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import Loader from "../Common/Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusRenderer, { CellStatusRenderer } from "./StatusRenderer";
const LeaveModal = dynamic(() => import("../Pop-ups/LeaveModal"), {
  ssr: false,
});
import data from "@/JSON/data.json";
import {
  dynamic_column_def,
  getCookie,
  getLeave,
  pushNotificationToDb,
  sendEmail,
  setDataToState,
  updatePermissionStatusInDB,
} from "@/functions";
import withOutsideClick from "@/HOC/closeModal";
const AddPermission = dynamic(() => import("../Pop-ups/AddPermission"), {
  ssr: false,
});
import useSystemTheme from "@/hooks/useSystemTheme";
import Tabs from "../Common/Tabs";
import { AnimatePresence, motion } from "framer-motion";

interface pmsInterface {
  headings: string[];
  db_data: any[];
}

const LeavesTable = () => {
  const systemTheme = useSystemTheme();
  const searchParams = useSearchParams();
  const searchQueryEmail = searchParams.get("email");
  const user = JSON.parse(getCookie("user") as any);
  const { showLoader, setShowLoader, searchKey } = usePmsContext();
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentDocId, setCurrentDocId] = useState("");
  const [gridApi, setGridApi] = useState<any>(null);
  const [crrData, setCrrData] = useState<unknown>();
  const [showLeaveModel, setShowLeaveModel] = useState(false);
  const [viewType, setViewType] = useState("detailedTable");
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

  const getAllUsersLeaveData = useCallback(async () => {
    let tempData: any = [];
    try {
      const q = query(
        collection(db, "permissions"),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      tempData = querySnapshot.docs.map((doc) => {
        const { created_at, ...allData } = doc.data();
        return {
          id: doc.id,
          ...allData,
        };
      });
    } catch (e) {
      console.error("Error fetching sorted documents: ", e);
      return [];
    }
    setDataToState(
      tempData,
      setShowLoader,
      setPmsData,
      viewType == "simpleTable"
    );
  }, [setShowLoader]);

  const getCurrentUserLeaves = useCallback(async () => {
    const userUid = searchQueryEmail ? searchQueryEmail : user?.email;

    try {
      const userCollection = collection(db, "permissions"); // Replace 'yourCollection' with your collection name
      const userQuery = query(userCollection, where("email", "==", userUid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        let tempData = querySnapshot.docs.map((doc) => {
          const { created_at, ...allData } = doc.data();
          return {
            id: doc.id,
            ...allData,
          };
        });

        setDataToState(
          tempData,
          setShowLoader,
          setPmsData,
          viewType == "simpleTable"
        );
      } else {
        setShowLoader(!showLoader);
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }, [setShowLoader, user?.uid]);

  const onGridReady = (params: any) => {
    setGridApi(params.api); // Storing the grid API for later use
  };

  const onCellClicked = (event: any) => {
    if (event.value !== undefined) {
      setCrrData(getLeave(event.data));
      setShowLeaveModel(true);
    }
  };

  const onTabChange = (tab_name: string) => {};

  const onViewChange = (view: string) => {
    setViewType(view);
  };

  useEffect(() => {
    if (gridApi) gridApi.setGridOption("quickFilterText", searchKey);
  }, [searchKey, gridApi]);

  useEffect(() => {
    if (searchQueryEmail) {
      getCurrentUserLeaves();
    } else {
      if (user && user?.role?.toLowerCase() !== "employee")
        getAllUsersLeaveData();
      else getCurrentUserLeaves();
    }
  }, [showLoader, getAllUsersLeaveData]);

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
              <div className="flex justify-between w-full border-b border-gray-200 dark:border-gray-700">
                <Tabs tabs={data.updates_tabs} onTabChange={onTabChange} />
                <div className="flex gap-4">
                  {data.data_view_types.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => onViewChange(item.name)}
                      type="button"
                      className="text-white bg-gray-800 hover:bg-gray-900 rounded-lg text-md p-0 w-10 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700  dark:border-gray-700"
                    >
                      <i className={`bi ${item.icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 w-full animate__animated animate__fadeIn">
                {pmsdata && pmsdata.db_data.length ? (
                  <>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <AnimatePresence>
                        <motion.div
                          className={`${
                            systemTheme == "dark"
                              ? "ag-theme-alpine-dark"
                              : "ag-theme-alpine"
                          } ag-grid-table overflow-y-scroll dm-sans rounded-sm `}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AgGridReact
                            rowData={pmsdata.db_data}
                            columnDefs={columnDefs as any}
                            className="dm-sans custom-cell-border text-xs md:text-base"
                            onGridReady={onGridReady}
                            animateRows={true}
                            onCellClicked={onCellClicked}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </>
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

export default LeavesTable;
