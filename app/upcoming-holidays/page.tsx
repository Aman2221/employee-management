import Layout from "@/components/Common/Layout";
import UpcomingLeavsComp from "@/components/Leave/UpcomingHolidayComp";
import React from "react";

const UpcomingLeaves = () => {
  return (
    <Layout showSearchInput={false}>
      <UpcomingLeavsComp />
    </Layout>
  );
};

export default UpcomingLeaves;
