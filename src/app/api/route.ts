import db, { offerTable, projectTable } from "@/db";
import { eq, sql } from "drizzle-orm";
import { NextApiRequest } from "next";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { project: string | undefined } }
) {
  const { searchParams } = new URL(req.url as string);
  const projectId = searchParams.get("project");

  if (!projectId) {
    return Response.json(
      { message: "A project id is required." },
      { status: 400 }
    );
  }

  const [randomOffer] = await db
    .select({
      offerId: offerTable.offerId,
      creativeId: offerTable.creativeId,
      projectId: offerTable.projectId,
      affiliateId: projectTable.affiliateId,
    })
    .from(offerTable)
    .where(eq(offerTable.projectId, projectId))
    .orderBy(sql.raw("RANDOM()"))
    .limit(1)
    .leftJoin(projectTable, eq(offerTable.projectId, projectTable.projectId));

  if (!randomOffer) {
    return Response.json(
      { message: "There is no offer/creative available for this project" },
      { status: 400 }
    );
  }

  const creativeRes = await fetch(
    `https://api.eflow.team/v1/networks/creatives/${randomOffer.creativeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Eflow-API-Key": process.env.EFLOW_API_KEY || "",
      },
    }
  );

  const creative: {html_code: string} = await creativeRes.json();

  const trackingLinkRes = await fetch(
    `https://api.eflow.team/v1/networks/tracking/offers/clicks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Eflow-API-Key": process.env.EFLOW_API_KEY || "",
      },
      body: JSON.stringify({
        network_affiliate_id: randomOffer.affiliateId,
        network_offer_id: randomOffer.offerId,
        sub4: "trig",
      }),
    }
  );

  const trackingLink: {url: string} = await trackingLinkRes.json();

  const newHtml = creative.html_code.replaceAll('{tracking_link}', trackingLink.url)
  creative.html_code = newHtml
  return Response.json(creative);
}
