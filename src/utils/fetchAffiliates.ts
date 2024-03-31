export interface AffilatesRes {
  affiliates: AffiliateRes[];
  paging: PagingRes;
}

export interface AffiliateRes {
  network_affiliate_id: number;
  network_id: number;
  name: string;
  account_status: string;
  account_manager_id: number;
  account_manager_name: string;
  account_executive_id: number;
  account_executive_name: string;
  today_revenue: string;
  time_created: number;
  time_saved: number;
  labels: string[];
  balance: number;
  last_login: number;
  global_tracking_domain_url: string;
  network_country_code: string;
  is_payable: boolean;
  payment_type: string;
}

export interface PagingRes {
  page: number;
  page_size: number;
  total_count: number;
}

export type Affiliate = {
  affiliateId: number;
  affiliateName: string;
};

export const fetchAffiliates = async () => {
  const affilates: Affiliate[] = [];
  const fetchPage = async (page?: number) => {
    const res = await fetch(
      `https://api.eflow.team/v1/networks/affiliatestable?page=${
        page || 1
      }&page_size=2000`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Eflow-API-Key": process.env.EFLOW_API_KEY || "",
        },
        body: JSON.stringify({
          filters: {
            account_status: "active",
          },
        }),
      }
    );
    const data: AffilatesRes = await res.json();
    data.affiliates.forEach((affilate) => {
      affilates.push({
        affiliateId: affilate.network_affiliate_id,
        affiliateName: affilate.name,
      });
    });

    if (data.paging.total_count > affilates.length + 1) {
      const nextPage = (page || 1) + 1;
      await fetchPage(nextPage);
    }
  };
  await fetchPage();
  return affilates;
};
