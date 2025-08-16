import z from "zod";
import { SaleInputSchema } from "./schemas/sale";
import { SaleItemInputSchema } from "./schemas/sale-item";

export enum PaymentMethod {
  CASH = "cash",
  QR = "qr_code",
  MIXED = "mixed",
}

export type SaleItemInput = z.infer<typeof SaleItemInputSchema>;
export type SaleInput = z.infer<typeof SaleInputSchema>;
