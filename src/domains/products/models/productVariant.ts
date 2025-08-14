import { relations } from "drizzle-orm";
import {
  bigint,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { products } from "./product";

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    name: text("name").notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    // Global auto-incrementing SKU
    sku: bigint("sku", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  table => ({
    productNameUnique: uniqueIndex("product_variants_product_name_unique").on(
      table.productId,
      table.name
    ),
    skuUnique: uniqueIndex("product_variants_sku_unique").on(table.sku),
  })
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);
