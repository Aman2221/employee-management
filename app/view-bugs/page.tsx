import Layout from "@/components/Common/Layout";
import BugsList from "@/components/View-Bugs";
import React from "react";

const ViewBugs = () => {
  return (
    <Layout showSearchInput={false}>
      <BugsList />
    </Layout>
  );
};

export default ViewBugs;
