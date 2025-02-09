"use client";
import { db } from "@/config/firebase";
import { bugsInterface } from "@/interfaces";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState, useCallback, useEffect } from "react";
import Loader from "../Common/Loader";
import Image from "next/image";
import { bugInputs } from "@/DefaultData";
import { controleText } from "@/functions";
import { Tooltip } from "react-tooltip";
import CustomTooltip from "../Common/Tooltip";

const BugsList = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [bugsData, setBugsData] = useState<bugsInterface[]>();

  const getAllBugs = useCallback(async () => {
    let tempData: unknown = [];
    try {
      const q = query(collection(db, "bugs"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      tempData = querySnapshot.docs.map((doc) => {
        const date = new Date(
          doc.data().created_at.seconds * 1000
        ).toLocaleDateString();
        let { created_at, ...filtered } = doc.data();
        return {
          id: doc.id,
          date: date,
          ...filtered,
        };
      });
    } catch (e) {
      console.error("Error fetching sorted documents: ", e);
      return [];
    }
    setBugsData(tempData as bugsInterface[]);
  }, [setShowLoader]);

  useEffect(() => {
    getAllBugs();
  }, []);

  return (
    <div className="container mx-auto">
      {showLoader && !bugsData && bugsData ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center text-gray-200">
            Reported Bugs Dashboard
          </h1>
          <h4 className="text-base text-gray-300 font-medium text-center my-2">
            Track, analyze, and resolve issues reported by users efficiently.
          </h4>

          <div className="mt-10">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {Object.keys(bugsData ? bugsData[0] : bugInputs)
                      .filter((i) => i !== "screenshot_upload")
                      .map((item, i) => (
                        <th scope="col" key={i} className="px-6 py-3">
                          {item.replaceAll("_", " ")}
                        </th>
                      ))}
                    <th scope="col" className="px-6 py-3">
                      Screenshots
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bugsData?.map((bug) => (
                    <tr
                      key={bug.id}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                    >
                      {Object.values(bug)
                        .filter((i) => typeof i === "string")
                        .map((item, i) => (
                          <th
                            key={bug.id + i.toString()}
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <CustomTooltip content={item} id="email-tooltip">
                              {controleText(item, 15)}
                            </CustomTooltip>
                          </th>
                        ))}
                      <td className="px-6 py-4 grid grid-cols-2 gap-2">
                        {bug.screenshot_upload.map((i, index) => (
                          <a
                            className="border border-blue-400"
                            key={i}
                            href={i}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              key={bug.id + index.toString()}
                              src={i}
                              height={50}
                              width={50}
                              alt={bug.device_browser_info}
                            />
                          </a>
                        ))}
                      </td>
                      {/* <td className="px-6 py-4">
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </a>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BugsList;
