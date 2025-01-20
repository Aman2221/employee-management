"use client";
import { Tooltip } from "react-tooltip";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  ErrorToast,
  SuccessToast,
  checkAllFields,
  checkLeaveFields,
  extraValidation,
  fetchEmployeeByEmpId,
  freshLeave,
} from "@/functions";
import json from "@/JSON/data.json";
import DropDown from "../Common/DropDown";
import LeaveDuration from "../Ag-Table/LeaveDuration";
import { slotType } from "@/interfaces";
import CustomTooltip from "../Common/Tooltip";

const AddPermission = ({
  data = freshLeave(),
  show,
  setShow,
}: {
  data?: { [key: string]: any };
  show: boolean;
  setShow: (a: boolean) => void;
}) => {
  const { setShowLoader } = usePmsContext();
  const [showPermissionDD, setPermissionDD] = useState(false);
  const [permission, setPermission] = useState(data);
  const [validations, setValidations] = useState(json.leaves_validations);
  const [showTimeSlot, setShowTimeSlot] = useState(true);
  const [isSlotSelected, setIsSlotSelected] = useState(false);

  const checkValues = () => {
    let getValidation = checkLeaveFields(permission);
    setValidations(getValidation);

    return checkAllFields(permission);
  };

  const handleInputChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let target: any = e.target;
    let value: any = e.target.value;
    let durationVal: number = permission.type == "permission" ? 4 : 10;
    extraValidation(target.name, value, validations, setValidations);
    if (target.name == "emp_id" && value.toString().length == 3) {
      const temp = await fetchEmployeeByEmpId(value.toString());
      if (temp) {
        Object.keys(temp).forEach((i) => (permission[i] = temp[i]));
      }
    }
    if (target.name == "duration" && parseInt(value) > durationVal) {
      setValidations({
        ...validations,
        durationLimit: parseInt(value) > durationVal,
      });
    } else {
      setValidations({
        ...validations,
        durationLimit:
          target.name == "duration" ? parseInt(value) > durationVal : false,
      });
      setPermission({
        ...permission,
        [target.name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let allFieldsAreValid = checkValues();
    if (allFieldsAreValid) {
      if (isSlotSelected) {
        setShow(!show);
        setShowLoader(true);
        addDocument();
      } else {
        ErrorToast(
          permission.type == "permission"
            ? "Please select both the start and end dates for your leave period"
            : "Please select both the start and end times for your leave period"
        );
      }
    }
  };

  const addDocument = async () => {
    try {
      const docRef = await addDoc(collection(db, "permissions"), permission);
      SuccessToast(
        permission.type == "permission" ? "Permission added" : "Leave Added"
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleLeaveType = (type: string) => {
    setPermission({
      ...permission,
      type,
    });
    setPermissionDD(!showPermissionDD);
    setShowTimeSlot(true);
  };

  const handleSaveSlot = (slot: slotType) => {
    setPermission({
      ...permission,
      ...slot,
    });
    setIsSlotSelected(true);
    setShowTimeSlot(!showTimeSlot);
  };

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        show ? "flex" : "hidden"
      } animate__animated animate__fadeInDown overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full modal-bg`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.name.length ? "Leave Details" : "Add Leave"}
            </h3>
            <CustomTooltip
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setShow(!show)}
              children={
                <>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </>
              }
              id="slot-tooltip"
              content="Close modal"
            />
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  EMP-ID (3 digit)
                  <sup>*</sup>
                </label>
                <input
                  type="number"
                  name="emp_id"
                  id="emp_id"
                  disabled={data.name.length}
                  onChange={handleInputChange}
                  value={permission.emp_id as any}
                  className="bg-gray-50 border outline-none focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Employee ID"
                />
                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.emp_id
                    ? "Employee ID is required"
                    : validations.isEmpId3Digit
                    ? "Employee ID can not be more then 3 numbers"
                    : ""}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name<sup>*</sup>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  disabled={data.name.length}
                  value={permission.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border outline-none focus:outline-noneborder-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Full name"
                />
                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.name
                    ? "Full name is required"
                    : validations.isNameWithSpecialCharOrNum
                    ? "Name should not contain multiple spaces, numbers and special characters"
                    : ""}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 relative">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Duration<sup>*</sup>
                  <span className="text-xs">
                    {permission.type === "permission"
                      ? "(in hours)"
                      : "(in days)"}
                  </span>
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  disabled={data.name.length}
                  value={permission.duration as any}
                  onChange={handleInputChange}
                  className="bg-gray-50 border outline-none focus:outline-noneborder-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="2"
                  maxLength={2}
                />
                {permission.duration.toString().length > 0 && (
                  <div className="absolute right-2 top-10">
                    <CustomTooltip
                      className="text-white text-sm absolute  font-bold "
                      onClick={() => setShowTimeSlot(!showTimeSlot)}
                      children={<i className="bi bi-calendar-range"></i>}
                      id="slot-tooltip"
                      content={
                        permission.type == "permission"
                          ? "Select time"
                          : "Select date"
                      }
                    />
                  </div>
                )}

                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.duration
                    ? "Duration is required"
                    : validations.durationLimit
                    ? permission.type == "permission"
                      ? "Duration can not be more then 4 hours"
                      : "Duration can not be more then 10"
                    : ""}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 relative">
                {showTimeSlot && permission.duration.length > 0 && (
                  <LeaveDuration
                    type={permission.type}
                    show={showTimeSlot}
                    handleSave={handleSaveSlot}
                  />
                )}
                <DropDown
                  label={"Leave/Permission Type"}
                  show={showPermissionDD}
                  setShow={setPermissionDD}
                  options={["permission", "sick", "casual"]}
                  extClass="w-44"
                  SelectBtnComp={
                    <button
                      type="button"
                      onClick={() => setPermissionDD(!showPermissionDD)}
                      className="py-2 capitalize px-4 text-sm font-medium text-gray-200 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-700 flex items-center gap-2 w-full justify-between"
                    >
                      <span>{permission.type}</span>
                      <i className="bi bi-caret-down mt-1"></i>
                    </button>
                  }
                  onChange={handleLeaveType}
                />

                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.type ? "Leave/Permission Type is required" : ""}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Emergency Contact<sup>*</sup>
                </label>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  disabled={data.name.length}
                  value={permission.phone}
                  onChange={handleInputChange}
                  className="bg-gray-50 border outline-none focus:outline-noneborder-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Phone"
                />
                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.phone
                    ? "Phone is required"
                    : validations.validPhone
                    ? "Please enter a valid phone number"
                    : ""}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="email"
                  className="invisible block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Emergency Contact<sup>*</sup>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  disabled={data.name.length}
                  onChange={handleInputChange}
                  value={permission.email}
                  className="bg-gray-50 border outline-none focus:outline-noneborder-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Email"
                />
                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.email
                    ? "Email is required"
                    : validations.validEmail
                    ? "Please enter a valid email"
                    : ""}
                </p>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Reason<sup>*</sup>
                </label>
                <textarea
                  name="reason"
                  id="reason"
                  disabled={data.name.length}
                  value={permission.reason}
                  rows={3}
                  onChange={handleInputChange}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  outline-none focus:outline-none"
                  placeholder="Reason for the leave"
                ></textarea>
                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.reason ? "Reason Type is required" : ""}
                </p>
              </div>
            </div>
            {!data.name.length ? (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Add Leave
                </button>
              </div>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPermission;
