import Layout from "@/components/Common/Layout";
import React, { Suspense } from "react";

const TestPage = () => {
  return (
    <Suspense>
      <Layout showSearchInput={false}></Layout>
    </Suspense>
  );
};

export default TestPage;
