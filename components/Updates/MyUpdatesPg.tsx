"use client";
import data from "@/JSON/data.json";
import Loader from "../Common/Loader";
import useSystemTheme from "@/hooks/useSystemTheme";
import dynamic from "next/dynamic";
import NoDataFound from "../Common/NoDataFound";
import DataFilters from "../Common/DataFilters";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useSearchParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import { DataCardViewUpdates } from "../Ag-Table/CardView";
import { updates } from "@/interfaces";
import {
  getCookie,
  getUpdate,
  handleCatchError,
  handleOverlay,
} from "@/functions";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AddUpdates = dynamic(() => import("../Pop-ups/AddUpdates"), {
  ssr: false,
});

const MyUpdatesPg = () => {
  const gridRef = useRef<AgGridReact>(null);
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

  const onCardClick = (data: updates) => {
    setCrrData(data);
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

        setUpdatesDataStore(tempData as updates[]);
        setTimeout(() => {
          if (tempData) setUpdatesData(tempData as updates[]);
          setShowLoader(false);
        }, 1000);
      } else {
        setShowLoader(!showLoader);
      }
    } catch (error) {
      handleCatchError(error);
      return null;
    }
  }, [setShowLoader, user?.uid, searchQuerytUid]);

  const getAllUpdatesData = useCallback(async () => {
    const tempData: unknown[] = [];
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
    setUpdatesDataStore(tempData as updates[]);

    setTimeout(() => {
      if (tempData) setUpdatesData(tempData as updates[]);
      setShowLoader(false);
    }, 1000);
  }, [setShowLoader]);

  const onTabChange = (tab_name: string) => {
    const selectedTab = tab_name.toLowerCase();
    if (gridRef.current && leaveFilter.view_type !== "cardView") {
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
    } else {
      let filter = updatesDataStore.filter(
        (item) => item.designation.toLowerCase() == selectedTab
      );
      setUpdatesData(tab_name !== "all" ? [...filter] : updatesDataStore);
    }

    setLeaveFilter({
      ...leaveFilter,
      leave_type: tab_name,
    });
  };

  const onStatusChange = (status: string) => {
    if (gridRef.current && leaveFilter.view_type !== "cardView") {
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
    } else {
      let filter = updatesDataStore.filter((item) => {
        if (item.status == status) return item;
      });
      setUpdatesData(status !== "status(all)" ? [...filter] : updatesDataStore);
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
          {updatesDataStore.length == 0 ? (
            <NoDataFound extClss="text-4xl mt-10" />
          ) : (
            <>
              <DataFilters
                updates_tabs={data.leaves_tabs}
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
                  "Completed",
                  "On Going",
                  "On Hold",
                ]}
                extClass="mx-auto container"
              />
              {updatesData.length ? (
                <div className="mt-6 w-full animate__animated animate__fadeIn container mx-auto">
                  {updatesData && updatesData?.length ? (
                    <>
                      {leaveFilter.view_type == "cardView" ? (
                        <div className="grid grid-cols-4 gap-6">
                          {updatesData.map((update: updates) => (
                            <div
                              key={update.id}
                              onClick={() => onCardClick(update)}
                            >
                              <DataCardViewUpdates
                                status={update.status}
                                date={update.date}
                                name={update.name}
                                email={update.email}
                                task={update.task}
                              />
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
              ) : (
                <NoDataFound extClss="mt-20 text-4xl" />
              )}

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
