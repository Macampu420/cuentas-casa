"use client";

import { ProductCreateInput } from "@/domains/products/types";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { useProducts } from "./state";

const ProductDialogContext = createContext<{
  open: boolean;
  changeOpen: (open: boolean) => void;
  createProduct: (values: ProductCreateInput) => Promise<void>;
}>({
  open: false,
  changeOpen: () => {},
  createProduct: () => Promise.resolve(),
});

const ProductDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { addProduct } = useProducts();

  const changeOpen = (next: boolean) => {
    setOpen(next);
  };

  const handleOperationSuccess = () => {
    toast.success("Producto creado correctamente");
    changeOpen(false);
  };

  const handleOperationError = (error: unknown) => {
    toast.error("Error al crear el producto");
    console.error(error);
  };

  const createProduct = async (values: ProductCreateInput) => {
    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      handleOperationError(response);
      return;
    }

    const created = (await response.json()) as {
      id: string;
      organization: string;
      name: string;
      variants: Array<{ id: string; name: string; unitPrice: string }>;
    };

    addProduct({
      id: created.id,
      organization: created.organization,
      name: created.name,
      variants: created.variants.map(createdVariant => ({
        id: createdVariant.id,
        name: createdVariant.name,
        unit_price: createdVariant.unitPrice,
      })),
    });

    handleOperationSuccess();
  };

  return (
    <ProductDialogContext.Provider value={{ open, changeOpen, createProduct }}>
      {children}
    </ProductDialogContext.Provider>
  );
};

export const useProductDialog = () => {
  const context = useContext(ProductDialogContext);
  if (!context) {
    throw new Error(
      "useProductDialog must be used within a ProductDialogProvider"
    );
  }
  return context;
};

export default ProductDialogProvider;
