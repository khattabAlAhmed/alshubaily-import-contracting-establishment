import { pgTable, text, timestamp, integer, primaryKey, boolean } from "drizzle-orm/pg-core";
import { images } from "./images-schema";

/**
 * Project Types table
 */
export const projectTypes = pgTable("project_types", {
    id: text("id").primaryKey(),
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    imageId: text("image_id").references(() => images.id, { onDelete: "set null" }),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Project Statuses table
 */
export const projectStatuses = pgTable("project_statuses", {
    id: text("id").primaryKey(),
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Projects table
 */
export const projects = pgTable("projects", {
    id: text("id").primaryKey(),
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    mainImageId: text("main_image_id").references(() => images.id, { onDelete: "set null" }),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    locationEn: text("location_en"),
    locationAr: text("location_ar"),
    year: integer("year"),
    projectTypeId: text("project_type_id").references(() => projectTypes.id, { onDelete: "set null" }),
    projectStatusId: text("project_status_id").references(() => projectStatuses.id, { onDelete: "set null" }),
    slugEn: text("slug_en").notNull().unique(),
    slugAr: text("slug_ar").notNull().unique(),
    isHighlighted: boolean("is_highlighted").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Project Images junction table - for additional project images
 */
export const projectImages = pgTable(
    "project_images",
    {
        projectId: text("project_id")
            .notNull()
            .references(() => projects.id, { onDelete: "cascade" }),
        imageId: text("image_id")
            .notNull()
            .references(() => images.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [primaryKey({ columns: [table.projectId, table.imageId] })]
);
