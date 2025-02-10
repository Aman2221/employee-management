import HomeComp from "@/components/HomeComp";
import Layout from "@/components/Common/Layout";
import React, { Suspense } from "react";

const HomePg = () => {
  return (
    <Suspense>
      <Layout>{<HomeComp />}</Layout>
    </Suspense>
  );
};

export default HomePg;
