"use client";

import { PaymentMethod, SaleInput, SaleItemInput } from "@/domains/sales/types";
import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { organizationEnumValues } from "@/domains/sales/models";

type AddVariantParams = {
  productVariantId: string;
  productId: string;
  productName: string;
  variantName: string;
  organization: string;
  unitPrice: number;
};

type SalesContextValue = {
  saleItems: SaleItemState[];
  addVariantToSale: (params: AddVariantParams) => void;
  clearSale: () => void;
  decrementVariant: (productVariantId: string) => void;
  totals: { totalQuantity: number; totalAmount: number };
  paymentMethod: PaymentMethod;
  changePaymentMethod: (nextMethod: PaymentMethod) => void;
  buildSaleCreateInput: () => SaleInput;
  createSale: () => Promise<void>;
};

const SalesContext = createContext<SalesContextValue | null>(null);

export type SaleItemState = SaleItemInput & {
  variantName: string;
  productName: string;
};

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [saleItems, setSaleItems] = useState<SaleItemState[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  const totals = useMemo(() => {
    const totalQuantity = saleItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalAmount = saleItems.reduce((acc, item) => acc + item.subtotal, 0);
    return { totalQuantity, totalAmount };
  }, [saleItems]);

  const addVariantToSale = (params: AddVariantParams) => {
    setSaleItems(previousItems => {
      const existingIndex = previousItems.findIndex(
        item => item.variantId === params.productVariantId
      );

      if (existingIndex >= 0) {
        const updated = [...previousItems];
        const existing = updated[existingIndex];
        const nextQuantity = existing.quantity + 1;
        updated[existingIndex] = {
          ...existing,
          quantity: nextQuantity,
          subtotal: nextQuantity * existing.unitPrice,
        };
        return updated;
      }

      const newItem: SaleItemState = {
        variantId: params.productVariantId,
        organization:
          params.organization as (typeof organizationEnumValues)[number],
        quantity: 1,
        unitPrice: params.unitPrice,
        subtotal: params.unitPrice,
        saleId: "",
        variantName: params.variantName,
        productName: params.productName,
      };
      return [newItem, ...previousItems];
    });
  };

  const decrementVariant = (productVariantId: string) => {
    setSaleItems(previousItems => {
      const index = previousItems.findIndex(
        item => item.variantId === productVariantId
      );
      if (index === -1) return previousItems;
      const updated = [...previousItems];
      const current = updated[index];
      const nextQuantity = Math.max(0, current.quantity - 1);
      if (nextQuantity === 0) {
        updated.splice(index, 1);
        return updated;
      }
      updated[index] = {
        ...current,
        quantity: nextQuantity,
        subtotal: nextQuantity * current.unitPrice,
      };
      return updated;
    });
  };

  const clearSale = () => setSaleItems([]);

  const changePaymentMethod = (nextMethod: PaymentMethod) => {
    setPaymentMethod(nextMethod);
  };

  const buildSaleCreateInput = (): SaleInput => {
    const items: SaleItemInput[] = saleItems.map(item => ({
      ...item,
      saleId: "",
      organization:
        item.organization as (typeof organizationEnumValues)[number],
    }));

    return {
      paymentMethod,
      totalAmount: totals.totalAmount,
      totalItems: totals.totalQuantity,
      saleItems: items,
    };
  };

  const createSale = async () => {
    const sale = buildSaleCreateInput();
    const response = await fetch("/api/sales", {
      method: "POST",
      body: JSON.stringify(sale),
    });
    if (!response.ok) {
      toast.error("Error al crear la venta");
      return;
    }

    clearSale();
    toast.success("Venta creada correctamente");
  };

  const value = useMemo<SalesContextValue>(
    () => ({
      saleItems,
      addVariantToSale,
      clearSale,
      decrementVariant,
      totals,
      paymentMethod,
      changePaymentMethod,
      buildSaleCreateInput,
      createSale,
    }),
    [saleItems, totals, paymentMethod]
  );

  return (
    <SalesContext.Provider value={value}>{children}</SalesContext.Provider>
  );
}

export function useSales() {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error("useSales must be used within a SalesProvider");
  return ctx;
}
