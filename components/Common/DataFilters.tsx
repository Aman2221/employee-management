import React from "react";
import Tabs from "./Tabs";
import TableViews from "./TableViews";
import DropDown from "./DropDown";
import hideOverlay from "@/HOC/hideOverlay";
type Obj = { [key: string]: string };

const DataFilters = ({
  updates_tabs,
  onTabChange,
  leave_type,
  onStatusChange,
  showDD,
  setShowDD,
  leave_status,
  onViewChange,
  data_view_types,
  view_type,
  dropDownmOtps,
  extClass = "",
  showTabs = true,
}: {
  updates_tabs: Obj[];
  onTabChange: (a: string) => void;
  leave_type: string;
  onStatusChange: (a: string) => void;
  showDD: boolean;
  setShowDD: (a: boolean) => void;
  leave_status: string;
  onViewChange: (a: string) => void;
  data_view_types: Obj[];
  view_type: string;
  dropDownmOtps: string[];
  extClass?: string;
  showTabs?: boolean;
}) => {
  const DropdownComp = hideOverlay(DropDown, setShowDD);

  return (
    <div
      className={`${extClass} flex justify-between w-full border-b border-gray-200 dark:border-gray-700`}
    >
      {showTabs && (
        <Tabs
          tabs={updates_tabs}
          onTabChange={onTabChange}
          activeTab={leave_type}
        />
      )}

      <div
        className={`flex ${
          showTabs ? "items-start gap-6" : "justify-between w-full"
        }`}
      >
        <DropdownComp
          extClass="w-32"
          onChange={onStatusChange}
          options={dropDownmOtps}
          SelectBtnComp={
            <button
              onClick={() => setShowDD(!showDD)}
              className="py-2 capitalize px-4 text-sm font-medium text-gray-200 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <span>{leave_status}</span>
              <i className="bi bi-caret-down mt-1"></i>
            </button>
          }
          show={showDD}
          setShow={setShowDD}
        />

        <TableViews
          onChange={onViewChange}
          views={data_view_types}
          activeView={view_type}
        />
      </div>
    </div>
  );
};

export default DataFilters;
