import Layout from "@/components/Common/Layout";
import RegisterPg from "@/components/Auth/RegisterPg";
import React from "react";

const RegisterUser = () => {
  return <Layout showSearchInput={false}>{<RegisterPg />}</Layout>;
};

export default RegisterUser;
