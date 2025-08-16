import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizationEnum } from "@/domains/shared/models/enums";
import { sales } from "./sale";
import { productVariants } from "@/domains/products/models/productVariant";

export const saleItems = pgTable("sale_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  saleId: uuid("sale_id")
    .notNull()
    .references(() => sales.id, { onDelete: "restrict", onUpdate: "restrict" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  organization: organizationEnum("organization").notNull(),
  quantity: integer("quantity").notNull(), // validate >= 1 in app layer
  unitPriceSnapshot: integer("unit_price_snapshot").notNull(),
  subtotalSnapshot: integer("subtotal_snapshot").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
  variant: one(productVariants, {
    fields: [saleItems.productVariantId],
    references: [productVariants.id],
  }),
}));
