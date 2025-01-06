import Layout from "@/components/Common/Layout";
import UserUpdates from "@/components/Updates/UserUpdates";
import React from "react";

const TestPage = () => {
  return (
    <Layout showSearchInput={false}>
      <UserUpdates />
    </Layout>
  );
};

export default TestPage;
