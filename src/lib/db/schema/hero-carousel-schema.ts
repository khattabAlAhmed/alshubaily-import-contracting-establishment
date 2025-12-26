import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { images } from "./images-schema";
import { articles } from "./blog-schema";
import { products } from "./products-schema";
import { mainServices, importServices, contractingServices } from "./services-schema";
import { projects } from "./projects-schema";

/**
 * Hero Sections table - container for grouping slides on main pages
 */
export const heroSections = pgTable("hero_sections", {
    id: text("id").primaryKey(),
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    slugEn: text("slug_en").notNull().unique(),
    slugAr: text("slug_ar").notNull().unique(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Slide type enum values
 */
export type SlideType =
    | "article"
    | "product"
    | "main_service"
    | "import_service"
    | "contracting_service"
    | "project"
    | "custom";

/**
 * Hero Slides table - individual slides
 * 
 * A slide can belong to ONE of:
 * - A hero section (for main page carousels)
 * - An import service (for import service page carousels)
 * - A contracting service (for contracting service page carousels)
 * 
 * Only one of heroSectionId, parentImportServiceId, or parentContractingServiceId should be set.
 */
export const heroSlides = pgTable("hero_slides", {
    id: text("id").primaryKey(),

    // Parent references - ONLY ONE should be set per slide
    heroSectionId: text("hero_section_id")
        .references(() => heroSections.id, { onDelete: "cascade" }),
    parentImportServiceId: text("parent_import_service_id")
        .references(() => importServices.id, { onDelete: "cascade" }),
    parentContractingServiceId: text("parent_contracting_service_id")
        .references(() => contractingServices.id, { onDelete: "cascade" }),

    // Bilingual content
    titleEn: text("title_en").notNull(),
    titleAr: text("title_ar").notNull(),
    subtitleEn: text("subtitle_en"),
    subtitleAr: text("subtitle_ar"),

    // Slide type - determines which content reference to use
    slideType: text("slide_type").notNull().$type<SlideType>(),

    // Content reference IDs - only one should be set based on slideType
    // For "custom" type, none of these are set (just title/subtitle/background)
    articleId: text("article_id").references(() => articles.id, { onDelete: "set null" }),
    productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
    mainServiceId: text("main_service_id").references(() => mainServices.id, { onDelete: "set null" }),
    importServiceId: text("import_service_id").references(() => importServices.id, { onDelete: "set null" }),
    contractingServiceId: text("contracting_service_id").references(() => contractingServices.id, { onDelete: "set null" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),

    // CTA Button
    ctaEnabled: boolean("cta_enabled").default(false).notNull(),
    ctaTextEn: text("cta_text_en"),
    ctaTextAr: text("cta_text_ar"),
    ctaHref: text("cta_href"),

    // Background
    backgroundImageId: text("background_image_id").references(() => images.id, { onDelete: "set null" }),
    backgroundColor: text("background_color"), // Hex color e.g., "#1a1a2e"
    overlayOpacity: integer("overlay_opacity").default(0), // 0-100

    // Status & Order
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
