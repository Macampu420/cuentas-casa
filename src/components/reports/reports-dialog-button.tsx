"use client";

import { Button } from "../ui/button";
import { useReports } from "@/providers/reports/state";

export default function ReportsDialogButton() {
  const { setDialogOpen } = useReports();

  return (
    <Button variant="outline" onClick={() => setDialogOpen(true)}>
      Ver reportes
    </Button>
  );
}
