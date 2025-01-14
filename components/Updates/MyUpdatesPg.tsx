"use client";
import { useSearchParams } from "next/navigation";
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
import data from "@/JSON/data.json";
import {
  getCookie,
  getUpdate,
  handleOverlay,
  setDataToState,
} from "@/functions";
const AddUpdates = dynamic(() => import("../Pop-ups/AddUpdates"), {
  ssr: false,
});
import useSystemTheme from "@/hooks/useSystemTheme";
import dynamic from "next/dynamic";
import Tabs from "../Common/Tabs";
import DropDown from "../Common/DropDown";
import TableViews from "../Common/TableViews";
import { DataCardViewUpdates } from "../Ag-Table/CardView";
import { updates } from "@/interfaces";
import NoDataFound from "../Common/NoDataFound";
import hideOverlay from "@/HOC/hideOverlay";

const MyUpdatesPg = () => {
  const gridRef: any = useRef(null);
  const systemTheme = useSystemTheme();
  const searchParams = useSearchParams();
  const searchQuerytUid = searchParams.get("uid");
  const user = JSON.parse(getCookie("user") as any);
  const { showLoader, setShowLoader, searchKey } = usePmsContext();
  const [showUpdateMdl, setShowUpdateMdl] = useState(false);
  const [gridApi, setGridApi] = useState<any>(null);
  const [crrData, setCrrData] = useState<unknown>();
  const [updatesData, setUpdatesData] = useState<updates[]>([]);
  const [updatesDataStore, setUpdatesDataStore] = useState<updates[]>([]);
  const [showDD, setShowDD] = useState(false);
  const DropdownComp = hideOverlay(DropDown, setShowDD);
  const [leaveFilter, setLeaveFilter] = useState({
    leave_type: "all",
    leave_status: "status(all)",
    view_type: "detailedTable",
  });

  const getColumnDefs = useMemo(() => {
    const tableColumnsDegs =
      leaveFilter.view_type == "detailedTable"
        ? data.update_column_defs
        : data.update_column_defs_simple;
    return tableColumnsDegs;
  }, [leaveFilter.view_type]);

  const onGridReady = (params: any) => {
    setGridApi(params.api); // Storing the grid API for later use
  };

  const onCellClicked = (event: any) => {
    setCrrData(getUpdate(event.data));
    setShowUpdateMdl(true);
  };

  const getCurrentUserUpdates = useCallback(async () => {
    const userUid = searchQuerytUid ? searchQuerytUid : user?.uid;

    try {
      const userCollection = collection(db, "updates"); // Replace 'yourCollection' with your collection name
      const userQuery = query(userCollection, where("uid", "==", userUid));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        let tempData = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        // setUpdatesDataStore([...tempData]);
        setDataToState(tempData, setShowLoader, setUpdatesData);
      } else {
        setShowLoader(!showLoader);
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }, [setShowLoader, user?.uid, searchQuerytUid]);

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
    setUpdatesDataStore([...tempData]);

    setDataToState(tempData, setShowLoader, setUpdatesData);
  }, [setShowLoader]);

  const onTabChange = (tab_name: string) => {
    const selectedTab = tab_name.toLowerCase();
    if (leaveFilter.view_type !== "cardView") {
      if (tab_name !== "all") {
        gridRef.current.api.setFilterModel({
          designation: {
            type: "equals",
            filter: selectedTab,
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
    if (leaveFilter.view_type !== "cardView") {
      if (status !== "status(all)") {
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
    setUpdatesData([...updatesData]);
    setLeaveFilter({ ...leaveFilter, view_type: view });
  };

  useEffect(() => {
    if (gridApi) gridApi.setGridOption("quickFilterText", searchKey);
  }, [searchKey, gridApi]);

  useEffect(() => {
    if (searchQuerytUid) {
      getCurrentUserUpdates();
    } else {
      if (user && user?.role?.toLowerCase() !== "employee") getAllUpdatesData();
      else getCurrentUserUpdates();
    }
  }, [showLoader, getAllUpdatesData, getCurrentUserUpdates, searchQuerytUid]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {updatesData.length == 0 ? (
            <NoDataFound extClss="text-4xl mt-10" />
          ) : (
            <>
              <div className="flex justify-between w-full border-b border-gray-200 dark:border-gray-700 mx-auto container">
                <div>
                  <Tabs
                    tabs={data.leaves_tabs}
                    onTabChange={onTabChange}
                    activeTab={leaveFilter.leave_type}
                  />
                </div>
                <div className="flex items-start gap-6">
                  <DropdownComp
                    extClass="w-32"
                    onChange={onStatusChange}
                    options={[
                      "status(all)",
                      "Completed",
                      "On Going",
                      "On Hold",
                    ]}
                    SelectBtnComp={
                      <button
                        onClick={() => setShowDD(!showDD)}
                        className="py-2 capitalize px-4 text-sm font-medium text-gray-200 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center gap-2"
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
              <div className="mt-6 w-full animate__animated animate__fadeIn container mx-auto">
                {updatesData && updatesData?.length ? (
                  <>
                    {leaveFilter.view_type == "cardView" ? (
                      <div className="grid grid-cols-4 gap-6">
                        {updatesData.map((update: updates) => (
                          <div key={update.id}>
                            <DataCardViewUpdates update={update} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <div
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
                          } ag-grid-table overflow-y-scroll dm-sans rounded-sm`}
                        >
                          <AgGridReact
                            ref={gridRef}
                            rowData={updatesData}
                            columnDefs={getColumnDefs as any}
                            className="dm-sans custom-cell-border"
                            onCellClicked={onCellClicked}
                            onGridReady={onGridReady}
                            suppressHorizontalScroll={
                              leaveFilter.view_type == "simpleTable"
                            }
                            domLayout="autoHeight"
                            noRowsOverlayComponent={NoDataFound}
                          />
                        </div>
                      </div>
                    )}
                  </>
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
