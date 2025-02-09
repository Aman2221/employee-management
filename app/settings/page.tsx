import Layout from "@/components/Common/Layout";
import SettingsComp from "@/components/settings";
import React from "react";

const Settings = () => {
  return (
    <Layout showSearchInput={false}>
      <SettingsComp />
    </Layout>
  );
};

export default Settings;
