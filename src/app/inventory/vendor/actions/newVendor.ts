"use server";

import { db } from "@/lib/db";
import { auth } from "@/app/auth";
import { AuthSession } from "@/types/auth";
import { ServerAction } from "@/types/action";
import { revalidatePath } from "next/cache";

export async function newVendor({
  name,
  email,
  phone,
  address,
  city,
  state,
  zip,
  company,
  website,
  notes,
}: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  company?: string;
  website?: string;
  notes?: string;
}): Promise<ServerAction> {
  const session = (await auth()) as AuthSession;
  const companyId = session?.user?.companyId;

  const newVendor = await db.vendor.create({
    data: {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      companyName: company,
      website,
      notes,
      companyId,
    },
  });

  revalidatePath("/inventory/vendor");

  return {
    type: "success",
    data: newVendor,
  };
}
