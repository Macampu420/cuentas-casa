"use client";

import { useSales } from "@/providers/sales/state";

export default function PaymentMethodSelector() {
  const { paymentMethod, changePaymentMethod } = useSales();

  return (
    <fieldset className="w-full max-w-[900px] mx-auto mt-4">
      <legend className="text-2xl font-extrabold">Método de pago</legend>
      <div className="grid grid-cols-3 gap-2">
        <label className="flex items-center gap-2 rounded-md border border-[#0ea5a3] px-3 py-2 cursor-pointer">
          <input
            type="radio"
            name="payment-method"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => changePaymentMethod("cash")}
            className="accent-[#0ea5a3]"
          />
          <span className="font-semibold">Efectivo</span>
        </label>
        <label className="flex items-center gap-2 rounded-md border border-[#0ea5a3] px-3 py-2 cursor-pointer">
          <input
            type="radio"
            name="payment-method"
            value="qr_code"
            checked={paymentMethod === "qr_code"}
            onChange={() => changePaymentMethod("qr_code")}
            className="accent-[#0ea5a3]"
          />
          <span className="font-semibold">QR</span>
        </label>
        <label className="flex items-center gap-2 rounded-md border border-[#0ea5a3] px-3 py-2 cursor-pointer">
          <input
            type="radio"
            name="payment-method"
            value="mixed"
            checked={paymentMethod === "mixed"}
            onChange={() => changePaymentMethod("mixed")}
            className="accent-[#0ea5a3]"
          />
          <span className="font-semibold">Mixto</span>
        </label>
      </div>
    </fieldset>
  );
}
