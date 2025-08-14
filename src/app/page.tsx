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

export default async function Home() {
  const productsWithVariants =
    (await getProductsWithVariants()) as ProductListItem[];

  console.log(productsWithVariants);

  return (
    <main className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <SalesProvider>
        <ProductsProvider initialProducts={productsWithVariants}>
          <ProductsList />
          <section>
            No ves el producto que buscas?
            <ProductDialogProvider>
              <ProductDialogButton />
              <ProductDialog />
            </ProductDialogProvider>
          </section>
          <SalesTable />
          <PaymentMethodSelector />
          <FinalizeSaleButton />
        </ProductsProvider>
      </SalesProvider>
    </main>
  );
}
