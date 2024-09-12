import React from "react";

const Avatar = ({
  imgSrc = "",
  name = "",
  onClick,
}: {
  imgSrc?: string;
  name?: string;
  onClick?: () => void;
}) => {
  function getInitials() {
    let nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      let firstNameInitial = nameParts[0][0].toUpperCase();
      let lastNameInitial = nameParts[nameParts.length - 1][0].toUpperCase();

      return firstNameInitial + lastNameInitial;
    } else {
      return name.slice(0, 1);
    }
  }

  const nameInitials = getInitials();

  return (
    <div onClick={onClick} className="cursor-pointer">
      {imgSrc && imgSrc.length && name.length == 0 ? (
        <img
          className="w-10 h-10 rounded-full"
          src="/docs/images/people/profile-picture-5.jpg"
          alt="Rounded avatar"
        ></img>
      ) : name.length ? (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-bold text-gray-600 dark:text-gray-300 poppins">
            {nameInitials}
          </span>
        </div>
      ) : (
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg
            className="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;
