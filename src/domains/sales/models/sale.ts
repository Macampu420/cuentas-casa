import {
  pgTable,
  timestamp,
  uuid,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { paymentMethodEnum } from "@/domains/shared/models/enums";

export const sales = pgTable("sales", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  totalItems: integer("total_items").default(0).notNull(),
  soldAt: timestamp("sold_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
