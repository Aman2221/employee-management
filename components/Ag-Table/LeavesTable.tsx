"use client";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import dynamic from "next/dynamic";
import DataCardView from "./CardView";
import Loader from "../Common/Loader";
import data from "@/JSON/data.json";
import useSystemTheme from "@/hooks/useSystemTheme";
import withOutsideClick from "@/HOC/closeModal";
import NoDataFound from "../Common/NoDataFound";
import DataFilters from "../Common/DataFilters";
import { AgGridReact } from "ag-grid-react";
import StatusRenderer, { CellStatusRenderer } from "./StatusRenderer";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { permissions, s, updates } from "@/interfaces";
import { CellClickedEvent } from "ag-grid-community";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  capitalizeFirstLetter,
  dynamic_column_def,
  getCookie,
  getLeave,
  handleCatchError,
  handleOverlay,
  handleStatusEmail,
  pushNotificationToDb,
  updatePermissionStatusInDB,
} from "@/functions";

const LeaveModal = dynamic(() => import("../Pop-ups/LeaveModal"), {
  ssr: false,
});
const AddPermission = dynamic(() => import("../Pop-ups/AddPermission"), {
  ssr: false,
});

const LeavesTable = () => {
  const gridRef = useRef<AgGridReact | null>(null);
  const systemTheme = useSystemTheme(); //For getting user theme
  const searchParams = useSearchParams();
  const searchQueryEmail = searchParams.get("email");
  const user = JSON.parse(getCookie("user") as any);
  const { showLoader, setShowLoader, searchKey } = usePmsContext();
  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [showDD, setShowDD] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentDocId, setCurrentDocId] = useState("");
  const [gridApi, setGridApi] = useState<any>(null);
  const [crrData, setCrrData] = useState<permissions | any>();
  const [showLeaveModel, setShowLeaveModel] = useState(false);
  const [pmsData, setPmsData] = useState<permissions[]>([]);
  const [pmsDataStore, setPmsDataStore] = useState<permissions[]>([]);
  const [leaveFilter, setLeaveFilter] = useState({
    leave_type: "all",
    leave_status: "status(all)",
    view_type: "detailedTable",
  });

  const LeaveModalComp = withOutsideClick(LeaveModal, () =>
    setOpenLeaveModal(false)
  );

  const openStatusUpdateModal: (a: s, b: s) => void = useCallback(
    (status: string, docId: string) => {
      setOpenLeaveModal(!openLeaveModal);
      setCurrentStatus(status);
      setCurrentDocId(docId);
    },
    [openLeaveModal]
  );

  const storeStatusToLocal: (status: string) => Promise<void> = async (
    status: string
  ) => {
    let all_data: any = pmsDataStore;

    const userIndex = all_data.findIndex(
      (user: any) => user.id === currentDocId
    );
    if (userIndex !== -1) {
      all_data[userIndex] = {
        ...all_data[userIndex], // Copy the existing user object
        status: status, // Update the status
      };
    }
    const current: permissions = all_data[userIndex];
    // This functions will sen a mail to user regarding their leave status
    await handleStatusEmail(
      current.name as string,
      current.type as string,
      current.start_date as string,
      current.start_time as string,
      current.end_date as string,
      current.end_time as string,
      current.date as string,
      current.email as string,
      current.status as string
    );
    const docId = all_data[userIndex].uid;
    const permission_name = all_data[userIndex].reason;
    //updating the updated data into both states
    setPmsData(all_data);
    setPmsDataStore(all_data);
    await updatePermissionStatusInDB(currentDocId, status); //updating status in database

    await pushNotificationToDb(docId, status, permission_name); //updating notification in database
  };

  const getColumnDefs = useMemo(() => {
    const dynamic_defs = dynamic_column_def(
      StatusRenderer,
      CellStatusRenderer,
      pmsDataStore,
      openStatusUpdateModal
    );
    const tableColumnsDefs =
      leaveFilter.view_type == "detailedTable"
        ? data.leaveDetailedColumnDefs
        : data.leaveSimpleColumnDefs;

    if (dynamic_defs) return [...tableColumnsDefs, ...dynamic_defs];
    else return [...tableColumnsDefs];
  }, [openStatusUpdateModal, leaveFilter.view_type]);

  const getAllUsersLeaveData = useCallback(async () => {
    let tempData: unknown = [];
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
    setPmsDataStore(tempData as permissions[]);

    setTimeout(() => {
      if (tempData) setPmsData(tempData as permissions[]);
      setShowLoader(false);
    }, 1000);
  }, [setShowLoader]);

  const getCurrentUserLeaves = useCallback(async () => {
    const userUid = searchQueryEmail ? searchQueryEmail : user?.email;

    try {
      const userCollection = collection(db, "permissions"); // Replace 'yourCollection' with your collection name
      const userQuery = query(userCollection, where("email", "==", userUid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        let tempData: unknown = querySnapshot.docs.map((doc) => {
          const { created_at, ...allData } = doc.data();
          return {
            id: doc.id,
            ...allData,
          };
        });
        setPmsDataStore(tempData as permissions[]);
        setTimeout(() => {
          if (tempData) setPmsData(tempData as permissions[]);
          setShowLoader(false);
        }, 1000);
      } else {
        setShowLoader(!showLoader);
      }
    } catch (error) {
      handleCatchError(error);
      return null;
    }
  }, [setShowLoader, searchQueryEmail, showLoader, user?.email]);

  const onGridReady = (params: any) => {
    setGridApi(params.api); // Storing the grid API for later use
  };

  const onCellClicked = (event: CellClickedEvent) => {
    if (event.value !== undefined) {
      setCrrData(getLeave(event.data));
      setShowLeaveModel(true);
    }
  };

  const onCardClick = (leaveData: permissions) => {
    setCrrData(leaveData);
    setShowLeaveModel(true);
  };

  const onTabChange = async (tab_name: string) => {
    const selectLeave = tab_name.replace("leave", "");

    const case_match = capitalizeFirstLetter(selectLeave).replace(/\s+/g, "");

    const checkPermission =
      selectLeave == "permission" ? "permission" : case_match;
    if (leaveFilter.view_type == "cardView") {
      let filter = pmsDataStore.filter((item) => item.type == checkPermission);
      setPmsData(tab_name !== "all" ? [...filter] : pmsDataStore);
    } else {
      if (tab_name !== "all") {
        gridRef?.current?.api.setFilterModel({
          type: {
            type: "equals",
            filter: checkPermission,
          },
        });
        handleOverlay(gridRef);
      } else {
        gridRef?.current?.api.setFilterModel(null);
      }
    }

    setLeaveFilter({
      ...leaveFilter,
      leave_type: tab_name,
    });
  };

  const onStatusChange = (status: string) => {
    if (leaveFilter.view_type == "cardView") {
      let filter = pmsDataStore.filter((item) => {
        if (item.status == status) return item;
      });
      setPmsData(status !== "status(all)" ? [...filter] : pmsDataStore);
    } else {
      if (status !== "status(all)" && gridRef.current) {
        gridRef.current.api.setFilterModel({
          status: {
            type: "equals",
            filter: status,
          },
        });
        handleOverlay(gridRef);
      } else {
        gridRef?.current?.api.setFilterModel(null);
      }
    }

    setLeaveFilter({
      ...leaveFilter,
      leave_status: status,
    });
    setShowDD(!showDD);
  };

  const onViewChange = (view: string) => {
    setPmsData([...pmsDataStore]);
    setLeaveFilter({ ...leaveFilter, view_type: view });
  };

  useEffect(() => {
    if (gridApi) gridApi.setGridOption("quickFilterText", searchKey);
  }, [searchKey, gridApi]);

  useEffect(() => {
    searchQueryEmail
      ? getCurrentUserLeaves()
      : user && user?.role?.toLowerCase() !== "employee"
      ? getAllUsersLeaveData()
      : getCurrentUserLeaves();
  }, [
    showLoader,
    getAllUsersLeaveData,
    getCurrentUserLeaves,
    searchQueryEmail,
  ]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {pmsDataStore.length == 0 ? (
            <NoDataFound />
          ) : (
            <>
              <DataFilters
                updates_tabs={data.updates_tabs}
                onTabChange={onTabChange}
                leave_type={leaveFilter.leave_type}
                onStatusChange={onStatusChange}
                showDD={showDD}
                setShowDD={setShowDD}
                leave_status={leaveFilter.leave_status}
                onViewChange={onViewChange}
                data_view_types={data.data_view_types}
                view_type={leaveFilter.view_type}
                dropDownmOtps={[
                  "status(all)",
                  "approved",
                  "rejected",
                  "pending",
                ]}
              />
              {pmsData.length ? (
                <div className="mt-6 w-full animate__animated animate__fadeIn">
                  {pmsDataStore && pmsDataStore.length ? (
                    leaveFilter.view_type == "cardView" ? (
                      <div className="grid grid-cols-4 gap-6">
                        {pmsData.map((leave) => (
                          <div
                            key={leave.created_at}
                            onClick={() => onCardClick(leave)}
                          >
                            <DataCardView
                              type={leave.type as string}
                              date={leave.date as string}
                              name={leave.name as string}
                              email={leave.email as string}
                              reason={leave.reason as string}
                              status={leave.status as string}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <AnimatePresence>
                          <motion.div
                            style={{
                              width:
                                leaveFilter.view_type == "simpleTable"
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
                              rowData={pmsDataStore}
                              columnDefs={getColumnDefs as any}
                              className="dm-sans custom-cell-border text-xs"
                              onGridReady={onGridReady}
                              animateRows={true}
                              onCellClicked={onCellClicked}
                              suppressHorizontalScroll={
                                leaveFilter.view_type == "simpleTable"
                              }
                              domLayout="autoHeight"
                              noRowsOverlayComponent={NoDataFound}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <NoDataFound extClss="mt-20 text-4xl" />
              )}
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
