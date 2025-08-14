"use client";

import { Button } from "@/components/ui/button";
import { useSales } from "@/providers/sales/state";
import { toast } from "sonner";
import { useState } from "react";

export default function FinalizeSaleButton() {
  const { saleItems, buildSaleCreateInput } = useSales();
  const [isBuilding, setIsBuilding] = useState(false);

  const handleFinalizeSale = async () => {
    if (saleItems.length === 0) {
      toast.error("No hay productos en la venta");
      return;
    }
    try {
      setIsBuilding(true);
      const payload = buildSaleCreateInput();
      console.log(payload);
      const jsonString = JSON.stringify(payload);

      try {
        await navigator.clipboard.writeText(jsonString);
        toast.success("Venta lista. JSON copiado al portapapeles");
      } catch {
        toast.success("Venta lista. JSON disponible en la consola");
      }

      // Para inspección inmediata durante el desarrollo
      // eslint-disable-next-line no-console
      console.log("Sale payload ready to send:", payload);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto mt-4 flex justify-end">
      <Button
        onClick={handleFinalizeSale}
        disabled={1 > 0 || isBuilding || saleItems.length === 0}
      >
        {isBuilding ? "Preparando..." : "Finalizar venta"}
      </Button>
    </div>
  );
}
