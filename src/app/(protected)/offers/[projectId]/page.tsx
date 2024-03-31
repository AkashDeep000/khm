import db, { offerTable, projectTable } from "@/db";
import { eq } from "drizzle-orm";
import { OfferTable } from "./offer-table";
import { columns } from "./offer-columns";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export default async function Page({ params }: { params: Params }) {
  const { projectId } = params;

  const offers = await db
    .select({
      offerId: offerTable.offerId,
      projectId: offerTable.projectId,
      offerName: offerTable.offerName,
      creativeName: offerTable.creativeName,
      affiliateName: projectTable.affiliateName,
      createdAt: offerTable.createdAt,
    })
    .from(offerTable)
    .where(eq(offerTable.projectId, projectId))
    .leftJoin(projectTable, eq(offerTable.projectId, projectTable.projectId));

  return (
    <div className="grid gap-4">
      <OfferTable columns={columns} data={offers} />
    </div>
  );
}
