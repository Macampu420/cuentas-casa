import { z } from "zod";
import { organizationEnumValues } from "./models";

export const ProductVariantInputSchema = z.object({
  name: z.string().min(1, "Nombre de la variante requerido"),
  unitPrice: z.number().positive("El precio debe ser mayor a 0"),
});

export const ProductCreateInputSchema = z.object({
  organization: z.enum(organizationEnumValues),
  name: z.string().min(1, "Nombre requerido"),
  variants: z
    .array(ProductVariantInputSchema)
    .min(1, "Debe haber al menos una variante"),
});
