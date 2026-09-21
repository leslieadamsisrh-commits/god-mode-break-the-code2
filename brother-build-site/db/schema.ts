import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  joinCode: text("join_code").notNull(),
  state: text("state").notNull(),
  rev: integer("rev").notNull().default(0),
  updatedAt: integer("updated_at").notNull(),
});
