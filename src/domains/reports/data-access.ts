import { db } from "@/db/client";
import { sales } from "@/domains/sales/models/sale";
import { saleItems } from "@/domains/sales/models/saleItem";
import { and, gte, lt, eq, sum } from "drizzle-orm";
import { getTodayRangeUtc } from "@/lib/timezone";

export async function getTodaySalesByOrg() {
  const { startUtc, nextStartUtc } = getTodayRangeUtc();

  const rows = await db
    .select({
      organization: saleItems.organization,
      totalSold: sum(saleItems.subtotalSnapshot),
    })
    .from(saleItems)
    .innerJoin(sales, eq(saleItems.saleId, sales.id))
    .where(and(gte(sales.soldAt, startUtc), lt(sales.soldAt, nextStartUtc)))
    .groupBy(saleItems.organization);

  return rows.map(row => ({
    organization: row.organization,
    totalSold: row.totalSold ?? 0,
  }));
}

export async function getTotalSoldToday() {
  const { startUtc, nextStartUtc } = getTodayRangeUtc();

  const rows = await db
    .select({
      totalSold: sum(saleItems.subtotalSnapshot),
    })
    .from(saleItems)
    .innerJoin(sales, eq(saleItems.saleId, sales.id))
    .where(and(gte(sales.soldAt, startUtc), lt(sales.soldAt, nextStartUtc)));

  return rows[0].totalSold ?? 0;
}
