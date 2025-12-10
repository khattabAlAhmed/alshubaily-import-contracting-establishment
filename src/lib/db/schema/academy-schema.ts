import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Example table to demonstrate the pattern
// Replace this with your own schema tables
export const item = pgTable("item", {
    id: text("id").primaryKey(),
    nameEn: text("name_en").notNull(),
    nameAr: text("name_ar").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
