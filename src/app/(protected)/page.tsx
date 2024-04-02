import { fetchAffiliates } from "@/utils/fetchAffiliates";
import db from "@/db";
import { fetchOffers } from "@/utils/fetchOffers";
import { CreateOfferForm } from "@/components/create-offer";
import { ProjectOfferView } from "@/components/project-offer-view";

export default async function Home() {
  const projects = await db.query.projectTable.findMany({
    with: {
      offers: true,
    },
  });

  const affiliates = await fetchAffiliates();
  const offers = await fetchOffers();

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
      <CreateOfferForm projects={projects} offers={offers} />
      <div className="w-full grid gap-3 bg-background p-4 rounded-lg shadow">
        <ProjectOfferView projects={projects} affiliates={affiliates} />
      </div>
    </div>
  );
}
