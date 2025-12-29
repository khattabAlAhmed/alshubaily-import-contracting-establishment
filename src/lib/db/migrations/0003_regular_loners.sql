CREATE TABLE "company_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"tagline_en" text,
	"tagline_ar" text,
	"description_en" text,
	"description_ar" text,
	"founded_year" integer,
	"logo_image_id" text,
	"hero_image_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commitments" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "commitments" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "company_values" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "company_values" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "years_count" integer;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "general_policies" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "general_policies" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "missions" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "missions" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_goals" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "organization_goals" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "strengths" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "strengths" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "visions" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "visions" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "work_principles" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "work_principles" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_logo_image_id_images_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_hero_image_id_images_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;