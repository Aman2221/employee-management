import Layout from "@/components/Common/Layout";
import PDFViewer from "@/components/Common/PDFViewer";
import React from "react";

const Documentation = () => {
  return (
    <Layout showSearchInput={false}>
      <PDFViewer pdfSrc="/pdf/documentation.pdf#zoom=175" />
    </Layout>
  );
};

export default Documentation;
