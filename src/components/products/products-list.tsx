"use client";

import { useProducts } from "@/providers/products/state";
import { useSales } from "@/providers/sales/state";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const productColumnColor = "#F09329";
const variantColumnColors = ["#95C23D", "#00A295", "#D60808"] as const;

export function formatCOP(amount: string | number) {
  const numeric = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(numeric || 0);
}

export default function ProductsList() {
  const { products } = useProducts();
  const { addVariantToSale, decrementVariant, saleItems } = useSales();
  const [tappedVariantId, setTappedVariantId] = useState<string | null>(null);

  const handleTap = (args: {
    productId: string;
    productName: string;
    organization: string;
    variantId: string;
    variantName: string;
    unitPrice: number;
  }) => {
    addVariantToSale({
      productVariantId: args.variantId,
      productId: args.productId,
      productName: args.productName,
      variantName: args.variantName,
      organization: args.organization,
      unitPrice: args.unitPrice,
    });
    setTappedVariantId(args.variantId);
    setTimeout(() => setTappedVariantId(null), 160);
  };

  return (
    <section className="w-full max-w-[1200px]">
      {products.map(product => (
        <div
          key={product.id}
          className="w-full my-2 grid grid-cols-[minmax(180px,280px)_1fr] overflow-hidden"
        >
          <div
            className="px-6 py-8 flex items-center"
            style={{ backgroundColor: productColumnColor }}
          >
            <h3 className="text-white font-extrabold text-3xl leading-none capitalize">
              {product.name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {product.variants?.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`px-6 py-8 min-w-[240px] flex flex-col justify-center ${
                    tappedVariantId === variant.id ? "animate-tap-bounce" : ""
                  }`}
                  style={{
                    backgroundColor:
                      variantColumnColors[index % variantColumnColors.length],
                  }}
                  onClick={() =>
                    handleTap({
                      productId: product.id,
                      productName: product.name,
                      organization: product.organization,
                      variantId: variant.id,
                      variantName: variant.name,
                      unitPrice:
                        typeof variant.unit_price === "string"
                          ? Math.round(Number(variant.unit_price))
                          : Math.round(variant.unit_price),
                    })
                  }
                >
                  <span className="text-white font-extrabold text-4xl leading-none">
                    {variant.name}
                  </span>
                  <span className="text-white font-extrabold text-4xl leading-none mt-4">
                    {formatCOP(variant.unit_price)}
                  </span>
                  <div className="mt-6 flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={event => {
                        event.stopPropagation();
                        decrementVariant(variant.id);
                      }}
                    >
                      −
                    </Button>
                    <span className="inline-flex min-w-8 justify-center rounded-md bg-white/20 px-2 py-1 text-white font-bold">
                      {saleItems.find(item => item.variantId === variant.id)
                        ?.quantity ?? 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={event => {
                        event.stopPropagation();
                        handleTap({
                          productId: product.id,
                          productName: product.name,
                          organization: product.organization,
                          variantId: variant.id,
                          variantName: variant.name,
                          unitPrice:
                            typeof variant.unit_price === "string"
                              ? Math.round(Number(variant.unit_price))
                              : Math.round(variant.unit_price),
                        });
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
