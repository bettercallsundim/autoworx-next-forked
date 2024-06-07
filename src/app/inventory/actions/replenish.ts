"use server";

import { db } from "@/lib/db";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function replenish({
  productId,
  date,
  vendorId,
  quantity,
  price,
  unit,
  lot,
  notes,
}: {
  productId: number;
  date: Date;
  vendorId?: number;
  quantity: number;
  price?: number;
  unit?: string;
  lot?: string;
  notes?: string;
}): Promise<ServerAction> {
  const newHistory = await db.inventoryProductHistory.create({
    data: {
      productId,
      date,
      quantity,
      notes,
      type: "Purchase",
    },
  });

  // update product quantity
  const product = await db.inventoryProduct.findUnique({
    where: { id: productId },
  });

  const newQuantity = product!.quantity! + quantity;

  await db.inventoryProduct.update({
    where: { id: productId },
    data: {
      quantity: newQuantity,
      price: price || product?.price,
      unit: unit || product?.unit,
      lot: lot || product?.lot,
    },
  });

  revalidatePath("/inventory");

  return {
    type: "success",
    data: newHistory,
  };
}
