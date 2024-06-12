DO $$ BEGIN
 CREATE TYPE "featureType" AS ENUM('FeatureCollection', 'Feature', 'Point', 'Polygon');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geoFeatures" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"type" "featureType" NOT NULL,
	"properties" json DEFAULT '{"name":""}'::json,
	"geometry" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now(),
	"user_email" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "harvests" (
	"id" serial PRIMARY KEY NOT NULL,
	"crop" varchar(256) NOT NULL,
	"date" date NOT NULL,
	"weight_g" integer NOT NULL,
	"area_m2" numeric(10, 3) NOT NULL,
	"yield_Kg_m2" numeric(10, 3) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_email" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"name" varchar(100),
	"image" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "geoFeatures" ADD CONSTRAINT "geoFeatures_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "harvests" ADD CONSTRAINT "harvests_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
