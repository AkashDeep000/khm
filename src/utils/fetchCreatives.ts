export interface CreativesRes {
  creatives: CreativeRes[];
  paging: PagingRes;
}

export interface CreativeRes {
  network_offer_creative_id: number;
  network_id: number;
  name: string;
  network_offer_id: number;
  network_offer_name: string;
  creative_type: string;
  is_private: boolean;
  creative_status: string;
  resource_url: string;
  html_code: string;
  width: number;
  height: number;
  email_from: string;
  email_subject: string;
  time_created: number;
  time_saved: number;
  optimized_thumbnail_url: string;
}

export interface PagingRes {
  page: number;
  page_size: number;
  total_count: number;
}

export type Creative = {
  creativeId: number;
  creativeName: string;
};

export const fetchCreatives = async (offerId: number) => {
  const creatives: Creative[] = [];
  const fetchPage = async (page?: number) => {
    const res = await fetch(
      `https://api.eflow.team/v1/networks/creativestable?page=${
        page || 1
      }&page_size=2000`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Eflow-API-Key": process.env.EFLOW_API_KEY || "",
        },
        body: JSON.stringify({
          search_terms: [
            {
              search_type: "creative_status",
              value: "active",
            },
            {
              search_type: "network_offer_id",
              value: offerId.toString(),
            },
          ],
        }),
      }
    );

    const data: CreativesRes = await res.json();
    
    data.creatives.forEach((creative) => {
      creatives.push({
        creativeId: creative.network_offer_creative_id,
        creativeName: creative.name,
      });
    });

    if (data.paging.total_count > creatives.length + 1) {
      const nextPage = (page || 1) + 1;
      await fetchPage(nextPage);
    }
  };
  await fetchPage();
  return creatives;
};
