"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type SaleItem = {
  productVariantId: string;
  productId: string;
  productName: string;
  variantName: string;
  organization: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

type AddVariantParams = {
  productVariantId: string;
  productId: string;
  productName: string;
  variantName: string;
  organization: string;
  unitPrice: number;
};

export type SaleCreateItemInput = {
  productVariantId: string;
  organization: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type PaymentMethod = "cash" | "qr_code" | "mixed";

export type SaleCreateInput = {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  totalItems: number;
  items: SaleCreateItemInput[];
};

type SalesContextValue = {
  saleItems: SaleItem[];
  addVariantToSale: (params: AddVariantParams) => void;
  clearSale: () => void;
  removeVariantCompletely: (productVariantId: string) => void;
  decrementVariant: (productVariantId: string) => void;
  totals: { totalQuantity: number; totalAmount: number };
  paymentMethod: PaymentMethod;
  changePaymentMethod: (nextMethod: PaymentMethod) => void;
  buildSaleCreateInput: () => SaleCreateInput;
};

const SalesContext = createContext<SalesContextValue | null>(null);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const addVariantToSale = (params: AddVariantParams) => {
    setSaleItems(previousItems => {
      const existingIndex = previousItems.findIndex(
        item => item.productVariantId === params.productVariantId
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

      const newItem: SaleItem = {
        productVariantId: params.productVariantId,
        productId: params.productId,
        productName: params.productName,
        variantName: params.variantName,
        organization: params.organization,
        quantity: 1,
        unitPrice: params.unitPrice,
        subtotal: params.unitPrice,
      };
      return [newItem, ...previousItems];
    });
  };

  const removeVariantCompletely = (productVariantId: string) => {
    setSaleItems(previousItems =>
      previousItems.filter(item => item.productVariantId !== productVariantId)
    );
  };

  const decrementVariant = (productVariantId: string) => {
    setSaleItems(previousItems => {
      const index = previousItems.findIndex(
        item => item.productVariantId === productVariantId
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

  const totals = useMemo(() => {
    const totalQuantity = saleItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalAmount = saleItems.reduce((acc, item) => acc + item.subtotal, 0);
    return { totalQuantity, totalAmount };
  }, [saleItems]);

  const changePaymentMethod = (nextMethod: PaymentMethod) => {
    setPaymentMethod(nextMethod);
  };

  const buildSaleCreateInput = (): SaleCreateInput => {
    const items: SaleCreateItemInput[] = saleItems.map(item => ({
      productVariantId: item.productVariantId,
      organization: item.organization,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));
    return {
      paymentMethod,
      totalAmount: totals.totalAmount,
      totalItems: totals.totalQuantity,
      items,
    };
  };

  const value = useMemo<SalesContextValue>(
    () => ({
      saleItems,
      addVariantToSale,
      clearSale,
      removeVariantCompletely,
      decrementVariant,
      totals,
      paymentMethod,
      changePaymentMethod,
      buildSaleCreateInput,
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
