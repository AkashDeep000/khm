"use server";

import db, { projectTable } from "@/db";
import { validateRequest } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import { SqliteError } from "better-sqlite3";
import { createProjectSchema, deleteProjectSchema } from "./schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type FormState = {
  error: boolean;
  message: string;
  feilds?: Record<string, string | number>;
  issues?: string[];
};

export async function createProjectAction(
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

  const parsedData = createProjectSchema.safeParse(formData);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "",
      feilds,
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db.insert(projectTable).values({
      ...parsedData.data,
    });
  } catch (error) {
    if (
      error instanceof SqliteError &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        error: true,
        message: "This projectId is already exist",
        feilds,
      };
    }
    console.error(error);
    return {
      error: true,
      message: "Error during database operation",
      feilds,
    };
  }
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully created the project",
    feilds,
  };
}

export async function deleteProjectAction(
  prevState: FormState,
  ptojectId: string
): Promise<FormState> {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  const parsedData = deleteProjectSchema.safeParse(ptojectId);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "",
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db
      .delete(projectTable)
      .where(eq(projectTable.projectId, parsedData.data));
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
    message: "Successfully deleted the project",
  };
}
