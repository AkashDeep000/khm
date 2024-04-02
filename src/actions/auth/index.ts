"use server";

import db, { userTable } from "@/db";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SqliteError } from "better-sqlite3";
import {
  signupSchema,
  loginSchema,
  createUserSchema,
  deleteUserSchema,
} from "./schema";
import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { SQLiteAsyncDialect } from "drizzle-orm/sqlite-core";

type FormState = {
  message: string;
  feilds?: Record<string, string>;
  issues?: string[];
  error?: boolean;
};

export async function signupAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const feilds: Record<string, string> = {};
  for (const key of Object.keys(formData)) {
    feilds[key] = formData[key].toString();
  }
  const parsedData = signupSchema.safeParse(formData);

  if (parsedData.success === false) {
    return {
      message: "",
      feilds,
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }
  const [totalUser] = await db.select({ count: count() }).from(userTable);

  try {
    if (totalUser.count > 0) {
      return {
        message: "Admin user already created",
        feilds,
      };
    }
    const [user] = await db
      .insert(userTable)
      .values({
        ...parsedData.data,
        role: "admin",
      })
      .returning();
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    if (
      error instanceof SqliteError &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        message: "This username is already used",
        feilds,
      };
    }
    console.error(error);

    return {
      message: "Error during database operation",
      feilds,
    };
  }
  return redirect("/");
}

export async function loginAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const feilds: Record<string, string> = {};
  for (const key of Object.keys(formData)) {
    feilds[key] = formData[key].toString();
  }
  const parsedData = loginSchema.safeParse(formData);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "Form validation error",
      feilds,
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, parsedData.data.username));
    if (!user) {
      return {
        error: true,
        message: "Username does not exist",
        feilds,
      };
    }
    if (user.password !== parsedData.data.password) {
      return {
        error: true,
        message:
          "Password isn't correct. Try again or Contact admin to reset the password",
        feilds,
      };
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    console.log(e);
    return {
      error: true,
      message: "Error during database operation",
      feilds,
    };
  }
  return redirect("/");
}

export async function logoutAction(): Promise<FormState> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}

export async function createUserAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  if (user.role !== "admin") {
    return {
      error: true,
      message: "You are not allowed to create user",
    };
  }

  const formData = Object.fromEntries(data);
  const feilds: Record<string, string> = {};
  for (const key of Object.keys(formData)) {
    feilds[key] = formData[key].toString();
  }
  const parsedData = createUserSchema.safeParse(formData);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "Form validation error",
      feilds,
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  try {
    await db.insert(userTable).values({
      ...parsedData.data,
    });
  } catch (error) {
    if (
      error instanceof SqliteError &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        error: true,
        message: "This username is already used",
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
  revalidatePath("/users");
  return {
    error: false,
    message: "Successfully created the user",
  };
}

export async function deleteUserAction(
  prevState: FormState,
  username: string
): Promise<FormState> {

  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  if (user.role !== "admin") {
    return {
      error: true,
      message: "You are not allowed to delete user",
    };
  }
  const parsedData = deleteUserSchema.safeParse(username);

  if (parsedData.success === false) {
    return {
      error: true,
      message: "",
      issues: parsedData.error.issues.map((issue) => issue.message),
    };
  }

  const [totalUser] = await db
    .select({ count: count() })
    .from(userTable)
    .where(eq(userTable.role, "admin"));
  const actionUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, parsedData.data));

  if (totalUser.count === 1 && actionUser[0].role === "admin") {
    return {
      error: true,
      message: "You need at least one admin user.",
    };
  }

  try {
    await db.delete(userTable).where(eq(userTable.username, parsedData.data));
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Error during database operation",
    };
  }
  revalidatePath("/users");
  return {
    error: false,
    message: "Successfully deleted the user",
  };
}
