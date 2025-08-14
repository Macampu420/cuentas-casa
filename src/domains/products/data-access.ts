import { db } from "@/db/client";
import { products, productVariants } from "./models";
import { eq, sql } from "drizzle-orm";
import { ProductCreateInput, productVariantInput } from "./types";

export async function createProduct(params: {
  organization: (typeof products)["organization"]["_"]["enumValues"][number];
  name: string;
}) {
  const [created] = await db
    .insert(products)
    .values({ organization: params.organization, name: params.name })
    .returning();
  return created;
}

export async function createProductVariant(params: {
  productId: string;
  name: string;
  unitPrice: string; // pass as string to preserve numeric
}) {
  const [created] = await db
    .insert(productVariants)
    .values({
      productId: params.productId,
      name: params.name,
      unitPrice: params.unitPrice,
    })
    .returning();
  return created;
}

export async function createProductWithVariants(params: ProductCreateInput) {
  const { organization, name, variants } = params;

  try {
    return await db.transaction(async transaction => {
      const [createdProduct] = await transaction
        .insert(products)
        .values({
          organization,
          name,
        })
        .returning();

      const createdVariants = await Promise.all(
        variants.map(async (variant: productVariantInput) => {
          const [createdVariant] = await transaction
            .insert(productVariants)
            .values({
              productId: createdProduct.id,
              name: variant.name,
              unitPrice: variant.unitPrice,
            })
            .returning();
          return createdVariant;
        })
      );

      return { ...createdProduct, variants: createdVariants };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProductsWithVariants() {
  return db
    .select({
      id: products.id,
      organization: products.organization,
      name: products.name,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      variants: sql`json_agg(product_variants.*)`.as("variants"),
    })
    .from(products)
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .groupBy(products.id);
}
