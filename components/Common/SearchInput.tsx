import React from "react";

const SearchInput = ({
  onInputChange,
  placeHolder = "Search here...",
}: {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder?: string;
}) => {
  return (
    <div className="bg-transparent outline-none border border-gray-400 rounded-lg px-3 py-2 shadow-lg w-80 flex gap-2 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{ fill: "rgba(255, 255, 255, 1)" }}
      >
        <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
      </svg>
      <input
        type="text"
        name="searchKey"
        id="searchKey"
        onChange={onInputChange}
        className="w-full bg-transparent outline-0"
        placeholder={placeHolder}
      />
    </div>
  );
};

export default SearchInput;
