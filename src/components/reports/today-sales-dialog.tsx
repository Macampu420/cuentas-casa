"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useReports } from "@/providers/reports/state";
import { formatCOP } from "../products/products-list";

export default function TodaySalesDialog() {
  const { dialogOpen, setDialogOpen } = useReports();

  type TodaySaleRow = {
    id: string;
    paymentMethod: string;
    totalAmount: string;
    totalItems: number;
  };

  const [todaySales, setTodaySales] = useState<TodaySaleRow[]>([]);
  type SalesByOrganizationRow = { organization: string; totalSold: number };
  const [salesByOrg, setSalesByOrg] = useState<SalesByOrganizationRow[]>([]);
  const [totalSold, setTotalSold] = useState<number>(0);

  useEffect(() => {
    if (!dialogOpen) return;

    const fetchData = async () => {
      const [allSalesRes, salesByOrgRes, totalSoldRes] = await Promise.all([
        fetch("/api/reports/today-sales", { cache: "no-store" }),
        fetch("/api/reports/today-sales/by-org", { cache: "no-store" }),
        fetch("/api/reports/today-sales/total-sold", { cache: "no-store" }),
      ]);

      const [allSalesData, salesByOrgData, totalSoldData] = await Promise.all([
        allSalesRes.json(),
        salesByOrgRes.json(),
        totalSoldRes.json(),
      ]);

      setTodaySales(allSalesData as TodaySaleRow[]);
      setSalesByOrg(salesByOrgData as SalesByOrganizationRow[]);
      setTotalSold(totalSoldData as number);
    };
    fetchData();
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ventas de hoy</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-xl">
            <strong>Total vendido:</strong> {formatCOP(totalSold)}
          </p>

          <div className="flex flex-col gap-2">
            <p className="text-xl">
              <strong>Ventas por organización:</strong>
            </p>
            <ul className="list-disc list-inside">
              {salesByOrg.map(org => (
                <li key={org.organization}>
                  {org.organization}: {formatCOP(org.totalSold)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Método de pago</th>
                <th className="text-left py-2 pr-4">Total</th>
                <th className="text-left py-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {todaySales.length === 0 ? (
                <tr>
                  <td className="py-3 text-muted-foreground" colSpan={3}>
                    Sin ventas registradas hoy
                  </td>
                </tr>
              ) : (
                todaySales.map(saleRow => (
                  <tr key={saleRow.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 capitalize">
                      {saleRow.paymentMethod.replace("_", " ")}
                    </td>
                    <td className="py-2 pr-4">
                      {formatCOP(saleRow.totalAmount)}
                    </td>
                    <td className="py-2">{saleRow.totalItems}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
