import { getTodaySalesByOrg } from "@/domains/reports/data-access";
import { NextResponse } from "next/server";

export async function GET() {
  const sales = await getTodaySalesByOrg();
  return NextResponse.json(sales);
}
