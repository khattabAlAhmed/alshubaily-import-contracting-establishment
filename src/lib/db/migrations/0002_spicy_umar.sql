CREATE TABLE "hero_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"slug_en" text NOT NULL,
	"slug_ar" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hero_sections_slug_en_unique" UNIQUE("slug_en"),
	CONSTRAINT "hero_sections_slug_ar_unique" UNIQUE("slug_ar")
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"hero_section_id" text,
	"parent_import_service_id" text,
	"parent_contracting_service_id" text,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"subtitle_en" text,
	"subtitle_ar" text,
	"slide_type" text NOT NULL,
	"article_id" text,
	"product_id" text,
	"main_service_id" text,
	"import_service_id" text,
	"contracting_service_id" text,
	"project_id" text,
	"cta_enabled" boolean DEFAULT false NOT NULL,
	"cta_text_en" text,
	"cta_text_ar" text,
	"cta_href" text,
	"background_image_id" text,
	"background_color" text,
	"overlay_opacity" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_hero_section_id_hero_sections_id_fk" FOREIGN KEY ("hero_section_id") REFERENCES "public"."hero_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_parent_import_service_id_import_services_id_fk" FOREIGN KEY ("parent_import_service_id") REFERENCES "public"."import_services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_parent_contracting_service_id_contracting_services_id_fk" FOREIGN KEY ("parent_contracting_service_id") REFERENCES "public"."contracting_services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_main_service_id_main_services_id_fk" FOREIGN KEY ("main_service_id") REFERENCES "public"."main_services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_import_service_id_import_services_id_fk" FOREIGN KEY ("import_service_id") REFERENCES "public"."import_services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_contracting_service_id_contracting_services_id_fk" FOREIGN KEY ("contracting_service_id") REFERENCES "public"."contracting_services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_background_image_id_images_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;