import Layout from "@/components/Common/Layout";
import PDFViewer from "@/components/Common/PDFViewer";
import React from "react";

const TravelAndExpenses = () => {
  return (
    <Layout showSearchInput={false}>
      <PDFViewer pdfSrc="/pdf/expenses-policy.pdf#zoom=175" />
    </Layout>
  );
};

export default TravelAndExpenses;
