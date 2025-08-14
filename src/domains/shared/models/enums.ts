import { pgEnum } from "drizzle-orm/pg-core";

export const organizationEnum = pgEnum("organization", [
  "casa_de_los_suenos",
  "trece_cerros",
  "calienta_espiritus",
]);

export const organizationEnumValues = [
  "casa_de_los_suenos",
  "trece_cerros",
  "calienta_espiritus",
] as const;

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "qr_code",
  "mixed",
]);
