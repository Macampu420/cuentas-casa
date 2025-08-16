import ProductDialogProvider from "@/providers/products/dialog";
import ProductDialogButton from "@/components/products/product-dialog-button";
import ProductDialog from "@/components/products/product-dialog";
import ProductsList from "@/components/products/products-list";
import {
  ProductsProvider,
  type ProductListItem,
} from "@/providers/products/state";
import { getProductsWithVariants } from "@/domains/products/data-access";
import { SalesProvider } from "@/providers/sales/state";
import PaymentMethodSelector from "@/components/sales/payment-method-selector";
import FinalizeSaleButton from "@/components/sales/finalize-sale-button";
import SalesTable from "@/components/sales/table";
import ReportsDialogButton from "@/components/reports/reports-dialog-button";
import { ReportsProvider } from "@/providers/reports/state";
import TodaySalesDialog from "@/components/reports/today-sales-dialog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const productsWithVariants =
    (await getProductsWithVariants()) as ProductListItem[];

  return (
    <main className="font-sans flex flex-col items-center justify-items-center min-h-screen p-5 pb-20 gap-16">
      <SalesProvider>
        <ProductsProvider initialProducts={productsWithVariants}>
          <ProductsList />
          <section>
            <span className="text-xl font-bold mr-4">
              No ves el producto que buscas?
            </span>
            <ProductDialogProvider>
              <ProductDialogButton />
              <ProductDialog />
            </ProductDialogProvider>
          </section>
          <SalesTable />
          <PaymentMethodSelector />
          <FinalizeSaleButton />
          <ReportsProvider>
            <ReportsDialogButton />
            <TodaySalesDialog />
          </ReportsProvider>
        </ProductsProvider>
      </SalesProvider>
    </main>
  );
}
