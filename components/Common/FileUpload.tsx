"use client";
import React from "react";

const FileUpload = ({
  label = " Upload multiple files",
  id = "multiple_files",
  handleChange,
}: {
  label?: string;
  id?: string;
  handleChange: (a: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <label
        className="block mb-2 text-sm font-medium text-gray-400 capitalize"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        onChange={handleChange}
        className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id={id}
        type="file"
        multiple
      />
    </div>
  );
};

export default FileUpload;
