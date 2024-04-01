import { CreateProjectForm } from "@/components/create-project";
import { fetchAffiliates } from "@/utils/fetchAffiliates";
import db, { userTable } from "@/db";
import { count, desc, eq, sql } from "drizzle-orm";
import { UserTable } from "./user-table";
import { columns } from "./user-columns";
import { CreateUserForm } from "@/components/create-user";

export default async function Page() {
  const users = await db
    .select({
      username: userTable.username,
      password: userTable.password,
      role: userTable.role,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .orderBy(desc(userTable.createdAt));

  
  return (
    <div className="grid gap-4">
      <div className="w-full grid gap-3 bg-background p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Users</h3>
         <CreateUserForm/>
        </div>
        <UserTable columns={columns} data={users} />
      </div>
    </div>
  );
}
