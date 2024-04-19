import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { useState } from "react";
import Body from "./Body";

export default async function InternalPage() {
  const session = (await auth()) as AuthSession;

  const users = await db.user.findMany({
    where: {
      NOT: {
        id: parseInt(session?.user?.id),
      },
      companyId: session?.user?.companyId,
    },
  });

  const messages = await db.message.findMany({
    where: {
      OR: [
        {
          from: parseInt(session?.user?.id),
        },
        {
          to: parseInt(session?.user?.id),
        },
      ],
    },
  });

  return (
    <div className="mt-5 flex gap-5">
      <Body users={users} currentUser={session.user} messages={messages} />
    </div>
  );
}
