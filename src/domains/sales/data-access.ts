import { db } from "@/db/client";
import { SaleInputSchema } from "./schemas/sale";
import { SaleInput } from "./types";
import { sales } from "./models/sale";
import { saleItems } from "./models/saleItem";
import { and, eq, sum, gte, lte } from "drizzle-orm";

export async function createSale(saleInput: SaleInput) {
  const parsed = SaleInputSchema.parse(saleInput);

  try {
    const { sale, savedItems } = await db.transaction(async transaction => {
      const [sale] = await transaction
        .insert(sales)
        .values({
          paymentMethod: parsed.paymentMethod,
          totalAmount: parsed.totalAmount.toString(),
          totalItems: parsed.totalItems,
          soldAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!sale) {
        throw new Error("Failed to create sale");
      }

      const savedItems = await Promise.all(
        parsed.saleItems.map(async item => {
          const [saleItem] = await transaction
            .insert(saleItems)
            .values({
              ...item,
              unitPriceSnapshot: item.unitPrice,
              subtotalSnapshot: item.subtotal,
              organization: item.organization,
              quantity: item.quantity,
              productVariantId: item.variantId,
              saleId: sale.id,
            })
            .returning();

          return saleItem;
        })
      );

      return { sale, savedItems };
    });

    return { sale, savedItems };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTodaySales() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todaySales = await db
    .select()
    .from(sales)
    .where(and(gte(sales.soldAt, startOfDay), lte(sales.soldAt, endOfDay)));

  return todaySales;
}
