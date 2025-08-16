import { z } from "zod";

export const SalePerOrganizationSchema = z.object({
  organization: z.string(),
  totalSold: z.number(),
});

export const SalesReportSchema = z.object({
  id: z.string(),
  totalSold: z.number(),
  totalSoldByOrganization: z.array(SalePerOrganizationSchema),
});

// export const SalesReportInputSchema = z.object({
//   sales: z.array(SalesReportSchema),
//   salePerOrganization: z.array(SalePerOrganizationSchema),
// });
