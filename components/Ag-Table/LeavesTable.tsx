"use client";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import TableViews from "../Common/TableViews";
import DropDown from "../Common/DropDown";
const LeavesTable = () => {
  const gridRef: any = useRef(null);
  const systemTheme = useSystemTheme();
  const searchParams = useSearchParams();
  const searchQueryEmail = searchParams.get("email");
  const user = JSON.parse(getCookie("user") as any);
  const { showLoader, setShowLoader, searchKey } = usePmsContext();
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [showDD, setShowDD] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentDocId, setCurrentDocId] = useState("");
  const [gridApi, setGridApi] = useState<any>(null);
  const [crrData, setCrrData] = useState<unknown>();
  const [showLeaveModel, setShowLeaveModel] = useState(false);
  const [pmsData, setPmsData] = useState<any[]>([]);
  const [leaveFilter, setLeaveFilter] = useState({
    leave_type: "all",
    leave_status: "status(all)",
    view_type: "detailedTable",
  });
  const LeaveModalComp = withOutsideClick(LeaveModal, () =>
    setOpenLeaveModal(false)
  );

  const openStatusUpdateModal: any = useCallback(
    (status: string, docId: string) => {
      setOpenLeaveModal(!openLeaveModal);
      setCurrentStatus(status);
      setCurrentDocId(docId);
    },
    [openLeaveModal]
  );

  const storeStatusToLocal = async (status: string) => {
    let all_data: any = pmsData;

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
    setPmsData(all_data);
    await updatePermissionStatusInDB(currentDocId, status); //updating status in database

    await pushNotificationToDb(docId, status, permission_name); //updating status in database
  };

  const getColumnDefs = useMemo(() => {
    const dynamic_defs = dynamic_column_def(
      StatusRenderer,
      CellStatusRenderer,
      pmsData,
      openStatusUpdateModal
    );
    const tableColumnsDegs =
      leaveFilter.view_type == "detailedTable"
        ? data.leaveDetailedColumnDefs
        : data.leaveSimpleColumnDefs;
    if (dynamic_defs) return [...tableColumnsDegs, ...dynamic_defs];
    else return [...tableColumnsDegs];
  }, [openStatusUpdateModal, pmsData]);

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
    setDataToState(tempData, setShowLoader, setPmsData);
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

        setDataToState(tempData, setShowLoader, setPmsData);
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

  const onTabChange = (tab_name: string) => {
    const selectLeave = tab_name.replace("leave", "");

    const case_match =
      selectLeave.slice(0, 1).toLocaleUpperCase() + selectLeave.slice(1);

    const checkPermission =
      selectLeave == "permission" ? "4 Hours" : case_match.replace(/\s+/g, "");

    if (tab_name !== "all") {
      gridRef.current.api.setFilterModel({
        type: {
          type: "equals",
          filter: checkPermission,
        },
      });
    } else {
      gridRef.current.api.setFilterModel(null);
    }
    setLeaveFilter({
      ...leaveFilter,
      leave_type: tab_name,
    });
  };

  const onStatusChange = (status: string) => {
    if (status !== "status(all)") {
      gridRef.current.api.setFilterModel({
        status: {
          type: "equals",
          filter: status,
        },
      });
    } else {
      gridRef.current.api.setFilterModel(null);
    }
    setLeaveFilter({
      ...leaveFilter,
      leave_status: status,
    });
    setShowDD(!showDD);
  };

  const onViewChange = (view: string) => {
    setPmsData([...pmsData]);
    setLeaveFilter({ ...leaveFilter, view_type: view });
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
          {pmsData.length == 0 ? (
            <div className="flex my-20 w-full justify-center items-center">
              <h1 className="md:text-4xl text-base text-center font-bold">
                No data
              </h1>
            </div>
          ) : (
            <>
              <div className="flex justify-between w-full border-b border-gray-200 dark:border-gray-700">
                <div>
                  <Tabs
                    tabs={data.updates_tabs}
                    onTabChange={onTabChange}
                    activeTab={leaveFilter.leave_type}
                  />
                </div>
                <div className="flex items-start gap-6">
                  <DropDown
                    onChange={onStatusChange}
                    options={["status(all)", "approved", "rejected", "pending"]}
                    SelectBtnComp={
                      <button
                        onClick={() => setShowDD(!showDD)}
                        className="py-2 capitalize px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <span>{leaveFilter.leave_status}</span>
                        <i className="bi bi-caret-down mt-1"></i>
                      </button>
                    }
                    show={showDD}
                    setShow={setShowDD}
                  />

                  <TableViews
                    onChange={onViewChange}
                    views={data.data_view_types}
                    activeView={leaveFilter.view_type}
                  />
                </div>
              </div>
              <div className="mt-6 w-full animate__animated animate__fadeIn">
                {pmsData && pmsData.length ? (
                  <>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <AnimatePresence>
                        <motion.div
                          style={{
                            width:
                              leaveFilter.view_type !== "detailedTable"
                                ? `${data.leaveSimpleColumnDefs.reduce(
                                    (total, col) => total + col.width,
                                    0
                                  )}px`
                                : "100%", // Calculate total width based on column widths
                            margin: "auto",
                          }}
                          className={`${
                            systemTheme == "dark"
                              ? "ag-theme-alpine-dark"
                              : "ag-theme-alpine"
                          } ag-grid-table ag-theme-alpine overflow-y-scroll dm-sans rounded-sm animate__animated animate__fadeIn`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AgGridReact
                            ref={gridRef}
                            rowData={pmsData}
                            columnDefs={getColumnDefs as any}
                            className="dm-sans custom-cell-border text-xs"
                            onGridReady={onGridReady}
                            animateRows={true}
                            onCellClicked={onCellClicked}
                            suppressHorizontalScroll={
                              leaveFilter.view_type !== "detailedTable"
                            }
                            domLayout="autoHeight"
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
