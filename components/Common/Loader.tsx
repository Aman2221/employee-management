"use client";
import React, { useState, useEffect } from "react";
import "@/styles/loader.css";

const Loader = ({ extClss = "my-48" }: { extClss?: string }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src="/loader/loader.gif" alt="Loading..." className="h-16" />
      </div>
    );
  }

  return null; // Return nothing after loading is done
};

export default Loader;
