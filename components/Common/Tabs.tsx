import React from "react";
type Obj = { [key: string]: string };

const Tabs = ({
  tabs,
  onTabChange,
}: {
  tabs: Obj[];
  onTabChange: (a: string) => void;
}) => {
  return (
    <div className="">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {tabs.map((item: Obj) => {
          return (
            <li
              onClick={() => onTabChange(item.tab_name)}
              className="me-2"
              key={item.tab_name}
            >
              <button className="gap-2  inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                <i className="bi bi-activity"></i>
                {item.tab_name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tabs;
