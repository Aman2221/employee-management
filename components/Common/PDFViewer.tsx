"use client";
import React from "react";

const PDFViewer = ({ pdfSrc }: { pdfSrc: string }) => {
  return (
    <div className="container mx-auto">
      <iframe
        src={pdfSrc}
        width="100%"
        className="pdf-iframe"
        style={{ border: "none" }}
        allow="fullscreen"
        loading="lazy"
        title="Company leave policy doc"
      ></iframe>
    </div>
  );
};

export default PDFViewer;
