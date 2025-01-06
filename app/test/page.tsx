import Layout from "@/components/Layout";
import UserUpdates from "@/components/UserUpdates";
import React from "react";

const TestPage = () => {
  return (
    <Layout showSearchInput={false}>
      <UserUpdates />
    </Layout>
  );
};

export default TestPage;
