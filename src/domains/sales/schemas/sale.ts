import { z } from "zod";
import { PaymentMethod } from "../types";
import { SaleItemInputSchema } from "./sale-item";

export const SaleInputSchema = z.object({
  id: z.string().optional(),
  paymentMethod: z.enum(PaymentMethod),
  totalAmount: z.number().positive(),
  totalItems: z.number().positive(),
  saleItems: z.array(SaleItemInputSchema),
});
