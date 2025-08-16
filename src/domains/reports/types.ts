import { z } from "zod";
import { SalesReportSchema } from "./schemas/sales";

export type SalesReport = z.infer<typeof SalesReportSchema>;
