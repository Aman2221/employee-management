import LoginPg from "@/components/Auth/LoginPg";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SelectLogin = () => {
  return (
    <>
      <LoginPg />
      <ToastContainer />
    </>
  );
};

export default SelectLogin;
