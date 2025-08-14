import {
  ProductCreateInputSchema,
  ProductVariantInputSchema,
} from "./product-schema";

export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;
export type productVariantInput = z.infer<typeof ProductVariantInputSchema>;
