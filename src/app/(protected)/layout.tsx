import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import db, { userTable } from "@/db";
import { count } from "drizzle-orm";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [totalUser] = await db.select({ count: count() }).from(userTable);
  if (totalUser.count === 0) {
    return redirect("/signup");
  }

  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <SiteHeader />
      <div className="p-2 sm:p-4 container max-w-screen-2xl">
        {children}
      </div>
    </>
  );
}
