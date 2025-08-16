"use client";

import { createContext, useContext, useState } from "react";

type ReportsContextValue = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ReportsContext.Provider value={{ dialogOpen, setDialogOpen }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used within a ReportsProvider");
  return ctx;
}
