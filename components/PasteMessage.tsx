"use client";
import { useState } from "react";
import moment from "moment";
import { db } from "@/config/firebase";
import { usePmsContext } from "@/context";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getCookie } from "@/functions";

const PasteMessage = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (a: boolean) => void;
}) => {
  const userUid = JSON.parse(getCookie("user") as string);
  const [message, setMessage] = useState("");
  const { setShowLoader, callGetData, setCallGetData } = usePmsContext();

  const handleExtractData = async (e: React.FormEvent) => {
    e.preventDefault();
    setShow(false);
    setShowLoader(true);
    const nameMatch = message.match(/Name\s*:\s*(.*)/i);
    const empIdMatch = message.match(/Emp\s*Id\s*:\s*(.*)/i);
    const durationMatch = message.match(/Duration\s*:\s*(.*)/i);
    const reasonMatch = message.match(/Reason\s*:\s*(.*)/i);
    const phoneMatch = message.match(/Phone\s*:\s*(.*)/i);
    const emailMatch = message.match(/Email\s*:\s*(.*)/i);
    const typeMatch = message.match(/Type\s*:\s*(.*)/i);

    const extractedInfo = {
      name: nameMatch ? nameMatch[1].trim() : "",
      emp_id: empIdMatch ? empIdMatch[1].trim() : "",
      duration: durationMatch ? durationMatch[1].trim() : "",
      reason: reasonMatch ? reasonMatch[1].trim() : "",
      type: typeMatch ? typeMatch[1].trim() : "",
      phone: phoneMatch ? phoneMatch[1].trim() : "",
      email: emailMatch ? emailMatch[1].trim() : "",
      date: moment().format("L"),
      time: moment().format("LTS"),
      created_at: Timestamp.now(),
      status: "pending",
      uid: userUid.uid,
      added_by: userUid.email,
    };

    try {
      const docRef = await addDoc(collection(db, "permissions"), extractedInfo);
      setCallGetData(!callGetData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  return (
    <div>
      <button onClick={handleExtractData}>Extract Data</button>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Paste message
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
            <form className="p-4 md:p-5" onSubmit={handleExtractData}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <textarea
                    name="reason"
                    id="reason"
                    value={message}
                    rows={8}
                    onChange={handleInputChange}
                    className="block outline-none p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Reason for the leave"
                  ></textarea>
                </div>
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
                  Add Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasteMessage;
