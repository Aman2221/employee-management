import Link from "next/link";
import React from "react";

const InDevelopment = () => {
  return (
    <div className="mt-20 container mx-auto flex flex-col justify-center items-center">
      <h1 className="text-4xl">Page Under Development</h1>
      <h3 className="text-base mt-3">
        We're working hard to bring this page to life—stay tuned for updates!
        asdfsdaf
      </h3>
      <Link
        href="/"
        className="w-max mt-5 text-base px-6 capitalize tracking-wide bg-slate-800 py-3 rounded-lg text-slate-300 font-semibold"
      >
        Home
      </Link>
    </div>
  );
};

export default InDevelopment;
