import { createProductWithVariants } from "@/domains/products/data-access";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const organizationEnumValues = [
  "casa_de_los_suenos",
  "trece_cerros",
  "calienta_espiritus",
] as const;

const ProductVariantInputSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  unitPrice: z.number().finite().positive("El precio debe ser mayor a 0"),
});

const ProductCreateInputSchema = z.object({
  organization: z.enum(organizationEnumValues),
  name: z.string().min(1, "Nombre requerido"),
  variants: z
    .array(ProductVariantInputSchema)
    .min(1, "Debe haber al menos una variante"),
});

const ProductVariantOutputSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  name: z.string(),
  unitPrice: z.string(),
  sku: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ProductCreateOutputSchema = z.object({
  id: z.string().uuid(),
  organization: z.enum(organizationEnumValues),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  variants: z.array(ProductVariantOutputSchema),
});

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const input = ProductCreateInputSchema.parse(raw);
    const product = await createProductWithVariants(input);
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", issues: error.flatten() },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
