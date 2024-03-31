"use server";

import db, { projectTable } from "@/db";
import { validateRequest } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import { eq } from "drizzle-orm";
import { getCreativesSchema } from "./schema";
import { Offer } from "@/utils/fetchOffers";
import { fetchCreatives } from "@/utils/fetchCreatives";

type FormState = {
  error: boolean;
  message?: string;
  issues?: string[];
  data?: Offer[]
};


export async function getCreativesAction(
    offerId: number
  ) {
    const { user } = await validateRequest();
    if (!user) {
      return redirect("/login");
    }
  
    const parsedData = getCreativesSchema.safeParse(offerId);
  
    if (parsedData.success === false) {
      return {
        error: true,
        message: "Validation Error",
        issues: parsedData.error.issues.map((issue) => issue.message),
      };    
    }
  
    try {
      const creatives = await fetchCreatives(offerId)
      return {
        error: false,
        data: creatives
      };
    } catch (error) {
      console.error(error);
      return {
        error: true,
        message: "Some error occored during creatives fetch",
      };
    }
  }
  
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  