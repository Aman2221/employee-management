"use client";
import moment from "moment";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { SuccessToast, getCookie } from "@/functions";
import data from "@/JSON/data.json";

const AddUpdates = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (a: boolean) => void;
}) => {
  const user = JSON.parse(getCookie("user") as string);
  const { setShowLoader } = usePmsContext();

  const [updates, setUpdates] = useState({
    website_names: "",
    status: "",
    task: "",
    assigned_by: "",
    verified_by: "",
    summary: "",
    emp_id: user.emp_id,
    designation: user.designation,
    email: user.email,
    name: user.username,
    date: moment().format("L"),
    time: moment().format("LTS"),
    created_at: Timestamp.now(),
    uid: user.uid,
    added_by: user.email,
  });

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let target: any = e.target;

    setUpdates({
      ...updates,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShow(!show);
    setShowLoader(true);
    addDocument();
  };

  const addDocument = async () => {
    try {
      const docRef = await addDoc(collection(db, "updates"), updates);
      SuccessToast("Updates added");
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
              Add updates
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
              {data.updates_fields.map((item) => {
                return (
                  <>
                    {item.name == "website_names" || item.name == "summary" ? (
                      <div className="col-span-2" key={item.name}>
                        <label
                          htmlFor={item.label}
                          className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {item.label}
                        </label>
                        <textarea
                          name={item.name}
                          id={item.name}
                          rows={2}
                          onChange={handleInputChange}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  outline-none focus:outline-none"
                          placeholder={item.placeholder}
                        ></textarea>
                      </div>
                    ) : (
                      <div className="col-span-1" key={item.name}>
                        <label
                          htmlFor={item.label}
                          className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {item.label}
                        </label>
                        <input
                          name={item.name}
                          id={item.name}
                          onChange={handleInputChange}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  outline-none focus:outline-none"
                          placeholder={item.placeholder}
                        />
                      </div>
                    )}
                  </>
                );
              })}
            </div>
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
                Add Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUpdates;
