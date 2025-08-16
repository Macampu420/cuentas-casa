import { createSale } from "@/domains/sales/data-access";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sale, savedItems } = await createSale(body);
  console.log(sale, savedItems);
  return NextResponse.json({ message: "Sale created", sale });
}
