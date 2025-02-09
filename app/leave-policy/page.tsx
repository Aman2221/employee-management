import Layout from "@/components/Common/Layout";
import PDFViewer from "@/components/Common/PDFViewer";
import React from "react";

const LeavePolicy = () => {
  return (
    <Layout showSearchInput={false}>
      <PDFViewer pdfSrc="/pdf/leave-policy.pdf#zoom=175" />
    </Layout>
  );
};

export default LeavePolicy;
