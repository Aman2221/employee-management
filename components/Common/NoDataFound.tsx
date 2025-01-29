import React from "react";
import "@/styles/not-found-text.css";

const NoDataFound = ({
  shine = true,
  text = "no results found",
  extClss = "text-lg dm-sans",
}: {
  shine?: boolean;
  text?: string;
  extClss?: string;
}) => {
  return (
    <div className="flex w-full justify-center items-center">
      {shine ? (
        <h1 className={`shine-animation-text ${extClss}`}>{text}</h1>
      ) : (
        <svg viewBox="0 0 600 300" className="not-found-text-svg">
          <symbol id="s-text">
            <text
              className={`uppercase ${extClss}`}
              text-anchor="middle"
              x="50%"
              y="20%"
              dy=".35em"
            >
              {text}
            </text>
          </symbol>
          <use className="not-found-text" xlinkHref="#s-text"></use>
          <use className="not-found-text" xlinkHref="#s-text"></use>
          <use className="not-found-text" xlinkHref="#s-text"></use>
          <use className="not-found-text" xlinkHref="#s-text"></use>
          <use className="not-found-text" xlinkHref="#s-text"></use>
        </svg>
      )}
    </div>
  );
};

export default NoDataFound;
