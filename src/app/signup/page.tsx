import { SignupForm } from "@/components/signup";
import db, { userTable } from "@/db";
import { count } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page() {
    const [totalUser] = await db.select({ count: count() }).from(userTable);
    if (totalUser.count > 0) {
        redirect('/login')
    }
    
  return (
    <div className="h-screen grid place-items-center">
        <SignupForm/>
    </div>
  );
}
