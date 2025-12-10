CREATE TABLE "bank" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"logo" text,
	"country_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"country_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"code" text NOT NULL,
	"timezone" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"bank_id" text,
	"deposit_attachment_url" text,
	"currency" text NOT NULL,
	"amount" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_type" (
	"id" text PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"percentage" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"project_type_id" text NOT NULL,
	"student_id" text NOT NULL,
	"specialist_id" text,
	"price" numeric NOT NULL,
	"deadline" timestamp,
	"delivered_at" timestamp,
	"payment_id" text,
	"payment_type_id" text
);
--> statement-breakpoint
CREATE TABLE "project_attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"attachment_name" text NOT NULL,
	"attachment_size" integer NOT NULL,
	"attachment_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_type" (
	"id" text PRIMARY KEY NOT NULL,
	"type_en" text NOT NULL,
	"type_ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "specialist" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"specialty_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "specialty" (
	"id" text PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone_number" text,
	"telegram_user" text,
	"nationality_id" text NOT NULL,
	"study_in" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "university" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"logo_url" text DEFAULT '/assets/university_placeholder.png'
);
--> statement-breakpoint
ALTER TABLE "bank" ADD CONSTRAINT "bank_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_bank_id_bank_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."bank"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_project_type_id_project_type_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."project_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_specialist_id_specialist_id_fk" FOREIGN KEY ("specialist_id") REFERENCES "public"."specialist"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_payment_type_id_payment_type_id_fk" FOREIGN KEY ("payment_type_id") REFERENCES "public"."payment_type"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_attachment" ADD CONSTRAINT "project_attachment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specialist" ADD CONSTRAINT "specialist_specialty_id_specialty_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialty"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_nationality_id_country_id_fk" FOREIGN KEY ("nationality_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_study_in_country_id_fk" FOREIGN KEY ("study_in") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;