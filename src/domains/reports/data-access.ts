import { db } from "@/db/client";
import { sales } from "@/domains/sales/models/sale";
import { saleItems } from "@/domains/sales/models/saleItem";
import { and, gte, lte, eq, sum } from "drizzle-orm";

export async function getTodaySalesByOrg() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      organization: saleItems.organization,
      totalSold: sum(saleItems.subtotalSnapshot),
    })
    .from(saleItems)
    .innerJoin(sales, eq(saleItems.saleId, sales.id))
    .where(and(gte(sales.soldAt, startOfDay), lte(sales.soldAt, endOfDay)))
    .groupBy(saleItems.organization);

  return rows.map(row => ({
    organization: row.organization,
    totalSold: row.totalSold ?? 0,
  }));
}

export async function getTotalSoldToday() {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      totalSold: sum(saleItems.subtotalSnapshot),
    })
    .from(saleItems)
    .innerJoin(sales, eq(saleItems.saleId, sales.id))
    .where(and(gte(sales.soldAt, startOfDay), lte(sales.soldAt, endOfDay)));

  return rows[0].totalSold ?? 0;
}
