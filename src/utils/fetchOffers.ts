export interface OffersRes {
  offers: OfferRes[];
  paging: PagingRes;
}

export interface OfferRes {
  network_offer_id: number;
  network_id: number;
  network_advertiser_id: number;
  name: string;
  offer_status: string;
  thumbnail_url: string;
  visibility: string;
  network_advertiser_name: string;
  category: string;
  network_offer_group_id: number;
  time_created: number;
  time_saved: number;
  payout: string;
  revenue: string;
  today_revenue: string;
  daily_conversion_cap: number;
  weekly_conversion_cap: number;
  monthly_conversion_cap: number;
  global_conversion_cap: number;
  daily_payout_cap: number;
  weekly_payout_cap: number;
  monthly_payout_cap: number;
  global_payout_cap: number;
  daily_revenue_cap: number;
  weekly_revenue_cap: number;
  monthly_revenue_cap: number;
  global_revenue_cap: number;
  daily_click_cap: number;
  weekly_click_cap: number;
  monthly_click_cap: number;
  global_click_cap: number;
  destination_url: string;
  encoded_value: string;
  labels: any;
  today_clicks: number;
  is_force_terms_and_conditions: boolean;
  project_id: string;
  channels: any;
  relationship: RelationshipRes;
  optimized_thumbnail_url: string;
  currency_id: string;
  revenue_amount: number;
  payout_amount: number;
  today_revenue_amount: number;
  today_payout_amount: number;
  payout_type: string;
  revenue_type: string;
}

export interface RelationshipRes {
  remaining_caps: RemainingCapsRes;
  ruleset: RulesetRes;
}

export interface RemainingCapsRes {
  remaining_daily_payout_cap: number;
  remaining_daily_revenue_cap: number;
  remaining_daily_conversion_cap: number;
  remaining_daily_click_cap: number;
  remaining_weekly_payout_cap: number;
  remaining_weekly_revenue_cap: number;
  remaining_weekly_conversion_cap: number;
  remaining_weekly_click_cap: number;
  remaining_monthly_payout_cap: number;
  remaining_monthly_revenue_cap: number;
  remaining_monthly_conversion_cap: number;
  remaining_monthly_click_cap: number;
  remaining_global_payout_cap: number;
  remaining_global_revenue_cap: number;
  remaining_global_conversion_cap: number;
  remaining_global_click_cap: number;
}

export interface RulesetRes {
  network_id: number;
  network_ruleset_id: number;
  time_created: number;
  time_saved: number;
  platforms: any[];
  device_types: any[];
  os_versions: any[];
  browsers: any[];
  languages: any[];
  countries: any[];
  regions: any[];
  cities: any[];
  dmas: any[];
  mobile_carriers: any[];
  connection_types: any[];
  ips: any[];
  is_block_proxy: boolean;
  is_use_day_parting: boolean;
  day_parting_apply_to: string;
  day_parting_timezone_id: number;
  days_parting: any[];
  isps: any[];
  brands: any[];
  postal_codes: PostalCodeRes[];
}

export interface PostalCodeRes {
  network_id: number;
  network_targeting_postal_code_id: number;
  postal_code: string;
  label: string;
  targeting_type: string;
  match_type: string;
}

export interface PagingRes {
  page: number;
  page_size: number;
  total_count: number;
}

export type Offer = {
  offerId: number;
  offerName: string;
};

export const fetchOffers = async () => {
  const offers: Offer[] = [];
  const fetchPage = async (page?: number) => {
    const res = await fetch(
      `https://api.eflow.team/v1/networks/offerstable?page=${
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
            offer_status: "active",
          },
        }),
      }
    );

    const data: OffersRes = await res.json();
    data.offers.forEach((offer) => {
      offers.push({
        offerId: offer.network_offer_id,
        offerName: offer.name,
      });
    });

    if (data.paging.total_count > offers.length + 1) {
      const nextPage = (page || 1) + 1;
      await fetchPage(nextPage);
    }
  };
  await fetchPage();
  return offers;
};
