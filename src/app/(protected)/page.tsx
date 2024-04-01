import { CreateProjectForm } from "@/components/create-project";
import { fetchAffiliates } from "@/utils/fetchAffiliates";
import db, { offerTable, projectTable, userTable } from "@/db";
import { count, desc, eq, sql } from "drizzle-orm";
import { ProjectTable } from "./project-table";
import { columns } from "./project-columns";
import { fetchOffers } from "@/utils/fetchOffers";
import { CreateOfferForm } from "@/components/create-offer";

export default async function Home() {
  const projects = await db
    .select({
      projectId: projectTable.projectId,
      affiliateId: projectTable.affiliateId,
      affiliateName: projectTable.affiliateName,
      createdAt: projectTable.createdAt,
      offerCount: count(offerTable.projectId),
    })
    .from(projectTable)
    .leftJoin(offerTable, eq(projectTable.projectId, offerTable.projectId))
    .groupBy(projectTable.projectId)
    .orderBy(desc(projectTable.createdAt));

  const affiliates = await fetchAffiliates();
  const offers = await fetchOffers();
  
  return (
    <div className="grid gap-4">
      <CreateOfferForm projects={projects} offers={offers}/>
      <div className="w-full grid gap-3 bg-background p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Projects</h3>
          <CreateProjectForm affiliates={affiliates} />
        </div>
        <ProjectTable columns={columns} data={projects} />
      </div>
    </div>
  );
}
