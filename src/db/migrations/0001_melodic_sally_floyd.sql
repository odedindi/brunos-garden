CREATE INDEX IF NOT EXISTS "type_idx" ON "geoFeatures" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "geoFeatures_user_idx" ON "geoFeatures" ("user_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "crop_idx" ON "harvests" ("crop");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "harvests_user_idx" ON "harvests" ("user_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");