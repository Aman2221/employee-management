"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PermissionCtx {
  showLoader: boolean;
  setShowLoader: (a: boolean) => void;
  searchKey: string;
  setSearchKey: (a: string) => void;
}

// Create the context with an initial value
const PmsContext = createContext<PermissionCtx | undefined>(undefined);

// Create a provider component
export const PmsProvider = ({ children }: { children: ReactNode }) => {
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [searchKey, setSearchKey] = useState<string>("");
  return (
    <PmsContext.Provider
      value={{
        showLoader,
        setShowLoader,
        searchKey,
        setSearchKey,
      }}
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
