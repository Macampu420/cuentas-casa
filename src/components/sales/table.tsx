"use client";

import { useSales } from "@/providers/sales/state";
import { formatCOP } from "../products/products-list";

export default function SalesTable() {
  const { saleItems, totals } = useSales();
  return (
    <div className="w-full max-w-[900px] mx-auto border-[10px] border-[#0ea5a3] bg-white overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-[#0ea5a3] text-white">
          <tr className="text-2xl font-extrabold">
            <th className="py-4 px-5 text-left">Producto</th>
            <th className="py-4 px-5 text-left">Variante</th>
            <th className="py-4 px-5 text-right">Precio unitario</th>
            <th className="py-4 px-5 text-center">Cantidad</th>
            <th className="py-4 px-5 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.map(item => (
            <tr
              key={item.variantId}
              className="border-b border-[#0ea5a3]/30 text-lg"
            >
              <td className="py-3 px-5 text-left font-semibold">
                {item.productName}
              </td>
              <td className="py-3 px-5 text-left">{item.variantName}</td>
              <td className="py-3 px-5 text-right">
                {formatCOP(item.unitPrice)}
              </td>
              <td className="py-3 px-5 text-center font-semibold">
                {item.quantity}
              </td>
              <td className="py-3 px-5 text-right font-semibold">
                {formatCOP(item.subtotal)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#0ea5a3]/10">
            <td className="py-3 px-5 text-left font-bold" colSpan={3}>
              Total
            </td>
            <td className="py-3 px-5 text-center font-extrabold">
              {totals.totalQuantity}
            </td>
            <td className="py-3 px-5 text-right font-extrabold">
              {formatCOP(totals.totalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
