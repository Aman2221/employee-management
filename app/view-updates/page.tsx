import Layout from "@/components/Common/Layout";
import MyUpdatesPg from "@/components/Updates/MyUpdatesPg";
import React, { Suspense } from "react";

const ViewUpdates = () => {
  return (
    <Suspense>
      <Layout>{<MyUpdatesPg />}</Layout>
    </Suspense>
  );
};

export default ViewUpdates;
