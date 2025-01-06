import React from "react";
import "@/styles/loader.css";

const Loader = ({ extClss = "my-48" }: { extClss?: string }) => {
  return (
    <div className={`flex justify-center items-center ${extClss}`}>
      <div className="loader shadow-lg"></div>
    </div>
  );
};

export default Loader;
