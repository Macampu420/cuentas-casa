"use client";

import { Button } from "@/components/ui/button";
import { useSales } from "@/providers/sales/state";
import { toast } from "sonner";
import { useState } from "react";

export default function FinalizeSaleButton() {
  const { saleItems, buildSaleCreateInput, createSale } = useSales();
  const [isBuilding, setIsBuilding] = useState(false);

  const handleFinalizeSale = async () => {
    if (saleItems.length === 0) {
      toast.error("No hay productos en la venta");
      return;
    }
    try {
      setIsBuilding(true);
      await createSale();
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto mt-4 flex justify-center">
      <Button
        className="text-3xl p-10"
        onClick={handleFinalizeSale}
        disabled={isBuilding || saleItems.length === 0}
      >
        {isBuilding ? "Preparando..." : "Finalizar venta"}
      </Button>
    </div>
  );
}
