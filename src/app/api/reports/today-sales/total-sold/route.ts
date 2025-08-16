import { NextResponse } from "next/server";
import { getTotalSoldToday } from "@/domains/reports/data-access";

export async function GET() {
  const total = await getTotalSoldToday();
  return NextResponse.json(total);
}
