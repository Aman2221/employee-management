"use client";
import React, { useEffect, useState } from "react";
import josn from "@/JSON/data.json";
import FloatingInput from "../Common/FloatingInput";
import { bugInterface } from "@/interfaces";
import { freshBug } from "@/DefaultData";
import DropDown from "../Common/DropDown";
import FileUpload from "../Common/FileUpload";
import { handleCatchError, storeBugToDB, storeImgToDB } from "@/functions";
import Image from "next/image";
import hideOverlay from "@/HOC/hideOverlay";

const ReportBug = () => {
  const gridInput: string[] = [
    "bug_priority",
    "device_browser_info",
    "expected_behaviour",
    "step_to_reproduce",
    "screenshot_upload",
  ];

  const [bugData, setBugData] = useState<bugInterface>(freshBug());
  const [showDd, setShowDd] = useState(false);
  const [imgFiles, setImgFiles] = useState<string[]>([]);
  const DropdownComp = hideOverlay(DropDown, setShowDd);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    let key = target.name;
    setBugData({
      ...bugData,
      [key]: target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const files = e.target.files;
      if (!files) return;

      const fileReaders: Promise<string>[] = [];

      for (const file of files) {
        fileReaders.push(
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
        );
      }

      Promise.all(fileReaders).then((images) => setImgFiles(images));
    }
  };

  const hadleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("imgFiles :", imgFiles);
    console.log("stringify :", JSON.stringify({ images: imgFiles }));
    console.log("parse :", JSON.parse(JSON.stringify({ images: imgFiles })));

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imgFiles }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await storeBugToDB({
        ...bugData,
        screenshot_upload: data.urls,
      });
    } catch (error) {
      handleCatchError(error);
    }
  };

  const handleDDChange = (a: string) => {
    setShowDd(!showDd);
    setBugData({
      ...bugData,
      bug_priority: a,
    });
  };

  useEffect(() => {}, [imgFiles]);

  return (
    <div className="w-[800px] mx-auto container">
      <h1 className="text-4xl font-bold text-center text-gray-200">
        Report a Bug
      </h1>
      <h4 className="text-base text-gray-300 font-medium text-center my-2">
        Help us improve by reporting bugs you encounter.
      </h4>
      <h4 className="text-xs text-gray-300 font-medium text-center my-2">
        For urgent issues, contact{" "}
        <a href="mailto:support@yourapp.com" className="font-bold text-sky-600">
          support@yourapp.com
        </a>
      </h4>

      <form className="w-full mt-10" onSubmit={hadleBugSubmit}>
        {josn.bug_fields
          .filter((i) => !gridInput.includes(i.name))
          .map((bug) => (
            <FloatingInput
              name={bug.name}
              label={bug.label}
              type={bug.type}
              onChange={handleInputChange}
              key={bug.name}
            />
          ))}
        <div className={"grid md:grid-cols-2 md:gap-6"}>
          {josn.bug_fields
            .filter((i) => gridInput.includes(i.name))
            .map((bug) => {
              return bug.name == "bug_priority" ? (
                <DropdownComp
                  key={bugData.bug_priority}
                  show={showDd}
                  setShow={setShowDd}
                  options={["bug priority", "low", "medium", "high"]}
                  onChange={handleDDChange}
                  SelectBtnComp={
                    <button
                      type="button"
                      onClick={() => setShowDd(!showDd)}
                      className="py-2 capitalize px-4 text-sm font-medium text-gray-200 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center gap-2 w-full justify-between"
                    >
                      <span>{bugData.bug_priority}</span>
                      <i className="bi bi-caret-down mt-1"></i>
                    </button>
                  }
                  extClass="w-72"
                />
              ) : (
                <FloatingInput
                  name={bug.name}
                  label={bug.label}
                  type={bug.type}
                  onChange={handleInputChange}
                  key={bug.name}
                />
              );
            })}
        </div>
        <FileUpload
          id="screenshot_upload"
          label="screenshot upload"
          handleChange={handleFileChange}
        />
        <div className="flex gap-5">
          {imgFiles?.map((pic) => (
            <div key={pic}>
              <Image
                src={pic}
                height={100}
                width={100}
                alt="bug screenshot"
                className="shadow shadow-slate-600"
              />
            </div>
          ))}
        </div>

        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="mt-6 flex self-end  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportBug;
