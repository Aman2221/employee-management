import Layout from "@/components/Common/Layout";
import UpcomingEventsComp from "@/components/Events";
import React from "react";

const UpcomingEvents = () => {
  return (
    <Layout showSearchInput={false}>
      <UpcomingEventsComp />
    </Layout>
  );
};

export default UpcomingEvents;
