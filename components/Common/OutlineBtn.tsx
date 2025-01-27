import React from "react";

const OutlineBtn = ({
  bg = "bg-primary-600",
  textColor = "text-white",
  size = "font-medium",
  buttonText = "submit",
}: {
  bg?: string;
  textColor?: string;
  size?: string;
  buttonText?: string;
}) => {
  return (
    <button
      type="submit"
      className={`w-full ${textColor} ${bg} ${size} border-gray-600 rounded-lg text-sm px-5 py-2.5 text-center capitalize`}
    >
      {buttonText}
    </button>
  );
};

export default OutlineBtn;
