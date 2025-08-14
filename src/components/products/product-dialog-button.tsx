"use client";

import { useProductDialog } from "@/providers/products/dialog";
import { Button } from "../ui/button";

export default function ProductDialogButton() {
  const { changeOpen } = useProductDialog();

  return (
    <Button variant="outline" onClick={() => changeOpen(true)}>
      Agregar producto
    </Button>
  );
}
