import React from "react";
import Avatar from "../Common/Avatar";
import CustomTooltip from "../Common/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { controleText } from "@/functions";
import { s } from "@/interfaces";

const DataCardViewLeaves = ({
  type,
  date,
  name,
  email,
  reason,
  status,
}: {
  type: s;
  date: s;
  name: s;
  email: s;
  reason: s;
  status: s;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="mt-10 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex w-full absolute -top-5 justify-between px-6">
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg capitalize">
            {type}
          </span>
          <span className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 ">
            {date}
          </span>
        </div>
        <div className="flex  items-center p-5 gap-10 mt-5">
          <Avatar
            extClass="h-20 w-20"
            name={name}
            fontSize="text-2xl"
            showAnimation={false}
          />
          <div>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {name}
            </h5>
            <h6 className="mb-1 text-base text-gray-300">
              <CustomTooltip content={email} id="email-tooltip">
                {controleText(email, 20)}
              </CustomTooltip>
            </h6>
            <span className="capitalize mt-1 text-xs text-gray-500 dark:text-gray-400">
              <CustomTooltip content={reason} id="reason-tooltip">
                {controleText(reason, 15)}
              </CustomTooltip>
              / {status}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const DataCardViewUpdates = ({
  status,
  date,
  name,
  email,
  task,
}: {
  status: s;
  date: s;
  name: s;
  email: s;
  task: s;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="mt-10 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex w-full absolute -top-5 justify-between px-6">
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg ">
            {status}
          </span>
          <span className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 ">
            {date}
          </span>
        </div>
        <div className="flex  items-center p-5 gap-10 mt-5">
          <Avatar
            extClass="h-20 w-20"
            name={name}
            fontSize="text-2xl"
            showAnimation={false}
          />
          <div>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {name}
            </h5>
            <h6 className="mb-1 text-base text-gray-300 ">
              <CustomTooltip content={email} id="email-tooltip">
                {controleText(email, 20)}
              </CustomTooltip>
            </h6>
            <span className="capitalize mt-1 text-xs text-gray-500 dark:text-gray-400">
              <CustomTooltip content={email} id="update-tooltip">
                {controleText(task, 15)}
              </CustomTooltip>
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DataCardViewLeaves;
