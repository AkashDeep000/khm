import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { uid } from "uid";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey().$default(uid),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  });

export type DatabaseUser = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const projectTable = sqliteTable("project", {
  id: text("id").notNull().primaryKey().$default(uid),
  projectId: text("project_id").notNull().unique(),
  affiliateId: integer("affiliate_id").notNull(),
  affiliateName: text("affiliate_name").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  });

export type DatabaseProject = typeof projectTable.$inferSelect;

export const projectRelations = relations(projectTable, ({ many }) => ({
  offers: many(offerTable),
}));

export const offerTable = sqliteTable("offer", {
  id: text("id").notNull().primaryKey().$default(uid),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.projectId, { onDelete: "cascade" }),
  offerId: integer("offer_id").notNull(),
  offerName: text("offer_name").notNull(),
  creativeId: integer("creative_id").notNull(),
  creativeName: text("creative_name").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  });

export const offerRelations = relations(offerTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [offerTable.projectId],
    references: [projectTable.projectId],
  }),
}));
