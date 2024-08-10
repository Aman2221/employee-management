"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PermissionCtx {
  callGetData: boolean;
  setCallGetData: (a: boolean) => void;
  showLoader: boolean;
  setShowLoader: (a: boolean) => void;
}

// Create the context with an initial value
const PmsContext = createContext<PermissionCtx | undefined>(undefined);

// Create a provider component
export const PmsProvider = ({ children }: { children: ReactNode }) => {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [callGetData, setCallGetData] = useState<boolean>(true);

  return (
    <PmsContext.Provider
      value={{ showLoader, setShowLoader, callGetData, setCallGetData }}
    >
      {children}
    </PmsContext.Provider>
  );
};

export const usePmsContext = () => {
  const context = useContext(PmsContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
