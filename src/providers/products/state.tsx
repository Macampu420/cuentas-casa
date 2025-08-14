"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type ProductVariantListItem = {
  id: string;
  name: string;
  unit_price: string | number;
};

export type ProductListItem = {
  id: string;
  organization: string;
  name: string;
  variants: ProductVariantListItem[];
};

type ProductsContextValue = {
  products: ProductListItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductListItem[]>>;
  addProduct: (created: ProductListItem) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({
  children,
  initialProducts,
}: {
  children: React.ReactNode;
  initialProducts: ProductListItem[];
}) {
  const [products, setProducts] = useState<ProductListItem[]>(initialProducts);

  const addProduct = (created: ProductListItem) => {
    setProducts(prevProducts => [created, ...prevProducts]);
  };

  const value = useMemo<ProductsContextValue>(
    () => ({ products, setProducts, addProduct }),
    [products]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return ctx;
}
