import { NextResponse } from "next/server";
import { getTodaySales } from "@/domains/sales/data-access";

export async function GET() {
  const sales = await getTodaySales();
  return NextResponse.json(sales);
}
