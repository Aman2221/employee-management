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
import data from "@/JSON/data.json";
import useSystemTheme from "@/hooks/useSystemTheme";
import { AnimatePresence, motion } from "framer-motion";
import DataCardView from "./CardView";
import { permissions } from "@/interfaces";
const LeaveModal = dynamic(() => import("../Pop-ups/LeaveModal"), {
  ssr: false,
});
import {
  dynamic_column_def,
  getCookie,
  getLeave,
  handleOverlay,
  pushNotificationToDb,
  sendEmail,
  setDataToState,
  updatePermissionStatusInDB,
} from "@/functions";
import withOutsideClick from "@/HOC/closeModal";
import NoDataFound from "../Common/NoDataFound";
import LeaveFilters from "../Common/DataFilters";
const AddPermission = dynamic(() => import("../Pop-ups/AddPermission"), {
  ssr: false,
});

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

  const openStatusUpdateModal: any = useCallback(
    (status: string, docId: string) => {
      setOpenLeaveModal(!openLeaveModal);
      setCurrentStatus(status);
      setCurrentDocId(docId);
    },
    [openLeaveModal]
  );

  const storeStatusToLocal = async (status: string) => {
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

    const html = `Hi ${all_data[userIndex].name}, Your leave for ${all_data[userIndex].reason} got ${status}`;
    // sendEmail("amanshivajisingh@gmail.com", "Leaves information", html);
    const docId = all_data[userIndex].uid;
    const permission_name = all_data[userIndex].reason;
    setPmsData(all_data);
    setPmsDataStore(all_data);
    await updatePermissionStatusInDB(currentDocId, status); //updating status in database

    await pushNotificationToDb(docId, status, permission_name); //updating status in database
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
    setPmsDataStore(tempData);
    setDataToState(tempData, setShowLoader, setPmsData);
  }, [setShowLoader]);

  const getCurrentUserLeaves = useCallback(async () => {
    const userUid = searchQueryEmail ? searchQueryEmail : user?.email;

    try {
      const userCollection = collection(db, "permissions"); // Replace 'yourCollection' with your collection name
      const userQuery = query(userCollection, where("email", "==", userUid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        let tempData: any = querySnapshot.docs.map((doc) => {
          const { created_at, ...allData } = doc.data();
          return {
            id: doc.id,
            ...allData,
          };
        });
        setPmsDataStore(tempData);
        setDataToState(tempData, setShowLoader, setPmsData);
      } else {
        setShowLoader(!showLoader);
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }, [setShowLoader, searchQueryEmail, showLoader, user?.email]);

  const onGridReady = (params: any) => {
    setGridApi(params.api); // Storing the grid API for later use
  };

  const onCellClicked = (event: any) => {
    if (event.value !== undefined) {
      setCrrData(getLeave(event.data));
      setShowLeaveModel(true);
    }
  };

  const onCardClick = (leaveData: permissions) => {
    setCrrData(leaveData);
    setShowLeaveModel(true);
  };

  const onTabChange = (tab_name: string) => {
    const selectLeave = tab_name.replace("leave", "");

    const case_match =
      selectLeave.slice(0, 1).toLocaleUpperCase() + selectLeave.slice(1);

    const checkPermission =
      selectLeave == "permission"
        ? "permission"
        : case_match.replace(/\s+/g, "");
    if (leaveFilter.view_type == "cardView") {
      let filter = pmsDataStore.filter((item) => item.type == checkPermission);
      setPmsData(tab_name !== "all" ? [...filter] : pmsDataStore);
    } else {
      if (tab_name !== "all") {
        gridRef.current.api.setFilterModel({
          type: {
            type: "equals",
            filter: checkPermission,
          },
        });
        handleOverlay(gridRef);
      } else {
        gridRef.current.api.setFilterModel(null);
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
        gridRef.current.api.setFilterModel(null);
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
    if (searchQueryEmail) {
      getCurrentUserLeaves();
    } else {
      if (user && user?.role?.toLowerCase() !== "employee")
        getAllUsersLeaveData();
      else getCurrentUserLeaves();
    }
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
              <LeaveFilters
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
                            <DataCardView leave={leave} />
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
