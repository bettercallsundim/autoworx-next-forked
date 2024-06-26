import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import AddNewProduct from "./AddNewProduct";
import { db } from "@/lib/db";
import { SyncLists } from "@/components/SyncLists";
import Sidebar from "./Sidebar";
import { getCompanyId } from "@/lib/companyId";
import ProductTable from "./ProductTable";

export default async function Page({
  searchParams: { productId },
}: {
  searchParams: { productId: string };
}) {
  const companyId = await getCompanyId();

  const supplies = await db.inventoryProduct.findMany({
    where: { companyId, type: "Supply" },
    include: {
      category: true,
      vendor: true,
    },
  });

  const products = await db.inventoryProduct.findMany({
    where: { companyId, type: "Product" },
    include: {
      category: true,
      vendor: true,
    },
  });

  const categories = await db.category.findMany({
    where: { companyId },
  });
  const vendors = await db.vendor.findMany({
    where: { companyId },
  });
  return (
    <div className="h-full">
      
      <SyncLists categories={categories} vendors={vendors} />

      <header className="flex justify-between">
        <Title>Inventory</Title>
        <AddNewProduct />
      </header>

      <div className="flex h-full w-full justify-between gap-3">
        <Tabs
          defaultValue="supplies"
          className="col-start-1 mt-3 flex h-[93%] min-h-0 flex-col overflow-clip"
        >
          <TabsList>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="supplies">Supplies</TabsTrigger>
          </TabsList>

          <TabsContent value="procurement">
            <p>Procurement</p>
          </TabsContent>

          <TabsContent value="products" className="overflow-x-scroll">
            <ProductTable
              products={products as any}
              currentProductId={parseInt(productId)}
            />
          </TabsContent>

          <TabsContent value="supplies">
            <ProductTable
              products={supplies as any}
              currentProductId={parseInt(productId)}
            />
          </TabsContent>
        </Tabs>

        <Sidebar productId={parseInt(productId)} />
      </div>
    </div>
  );
}
