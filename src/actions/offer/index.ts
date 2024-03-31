"use server";

import db, { offerTable } from "@/db";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOfferSchema, deleteOfferSchema } from "./schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { off } from "process";

type FormState = {
  error: boolean;
  message: string;
  feilds?: Record<string, string | number>;
  issues?: string[];
};

export async function createOfferAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const { session } = await validateRequest();
  if (!session) {
    return redirect("/login");
  }

  const formData = Object.fromEntries(data);
  const feilds: Record<string, string> = {};
  for (const key of Object.keys(formData)) {
    feilds[key] = formData[key].toString();
  }

  const parsedData = createOfferSchema.safeParse(formData);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "",
      feilds,
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db.insert(offerTable).values({
      ...parsedData.data,
    });
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Some unknown Error occored",
      feilds,
    };
  }
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully created the offer",
    feilds,
  };
}

export async function deleteOfferAction(
  prevState: FormState,
  offerId: number
): Promise<FormState> {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const parsedData = deleteOfferSchema.safeParse(offerId);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "Got Invalid offerId",
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db.delete(offerTable).where(eq(offerTable.offerId, parsedData.data));
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Some unknown Error occored",
    };
  }
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully deleted the offer",
  };
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
