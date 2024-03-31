import { LoginForm } from "@/components/login";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import db, { userTable } from "@/db";
import { count } from "drizzle-orm";

export default async function Page() {
  const [totalUser] = await db.select({ count: count() }).from(userTable);
	if (totalUser.count === 0) {
		return redirect("/signup");
	  }
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="h-screen grid place-items-center">
      <LoginForm />
    </div>
  );
}
