import { z } from "zod";
import { organizationEnumValues } from "../models";

export const SaleItemInputSchema = z.object({
  id: z.string().optional(),
  saleId: z.string(),
  variantId: z.string(),
  organization: z.enum(organizationEnumValues),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  subtotal: z.number().positive(),
});
