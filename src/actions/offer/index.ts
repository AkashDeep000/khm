"use server";

import db, { offerTable } from "@/db";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOffersSchema, deleteOfferSchema } from "./schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type FormState = {
  error: boolean;
  message: string;
  issues?: string[];
};

export async function createOffersAction(
  prevState: FormState,
  formData: z.infer<typeof createOffersSchema>
): Promise<FormState> {
  const { session } = await validateRequest();
  if (!session) {
    return redirect("/login");
  }

  const parsedData = createOffersSchema.safeParse(formData);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "Form validation error",
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db.insert(offerTable).values(
     parsedData.data.projectIds.map(projectId => ({
      projectId,
      creativeId: parsedData.data.creativeId,
      creativeName: parsedData.data.creativeName,
      offerId: parsedData.data.offerId,
      offerName: parsedData.data.offerName,
     }))
    );
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Error during database operation",
    };
  }
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully created the offer",
  };
}

export async function deleteOfferAction(
  prevState: FormState,
  offerId: string
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
    await db.delete(offerTable).where(eq(offerTable.id, parsedData.data));
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Error during database operation",
    };
  }
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully deleted the offer",
  };
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
