"use client";
import moment from "moment";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  checkAllFields,
  checkLeaveFields,
  extraValidation,
  freshLeave,
} from "@/functions";
import json from "@/JSON/data.json";

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

  const [permission, setPermission] = useState(data);
  const [validations, setValidations] = useState(json.leaves_validations);

  const checkValues = () => {
    let getValidation = checkLeaveFields(permission);
    setValidations(getValidation);

    return checkAllFields(permission);
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let target: any = e.target;
    let value: any = e.target.value;
    extraValidation(target.name, value, validations, setValidations);

    setPermission({
      ...permission,
      [target.name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let allFieldsAreValid = checkValues();
    if (allFieldsAreValid) {
      setShow(!show);
      setShowLoader(true);
      addDocument();
    }
  };

  const addDocument = async () => {
    try {
      const docRef = await addDoc(collection(db, "permissions"), permission);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        show ? "flex" : "hidden"
      } animate__animated animate__fadeInDown overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3
              onClick={() => console.log(moment().format("MMMM Do YYYY"))}
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {data.name.length ? "Leave Details" : "Add Leave"}
            </h3>
            <button
              onClick={() => setShow(!show)}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
            >
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
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  EMP-ID<sup>*</sup>
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

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Duration<sup>*</sup>
                  <span className="text-xs">
                    {permission.type === "4 Hours" ? "(in hours)" : "(in days)"}
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
                <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                  {validations.duration ? "Duration is required" : ""}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Leave/Permission Type<sup>*</sup>
                </label>
                <select
                  id="type"
                  name="type"
                  disabled={data.name.length}
                  className="bg-gray-50 border outline-none focus:outline-noneborder-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  value={permission.type}
                  onChange={handleInputChange}
                >
                  <option value="4 Hours">4 Hours</option>
                  <option value="Sick">Sick</option>
                  <option value="Casual">Casual</option>
                </select>
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
