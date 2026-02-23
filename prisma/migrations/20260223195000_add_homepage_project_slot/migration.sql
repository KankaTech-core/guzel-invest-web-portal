ALTER TABLE "listings"
ADD COLUMN "homepageProjectSlot" INTEGER;

CREATE INDEX "listings_homepageProjectSlot_status_idx"
ON "listings"("homepageProjectSlot", "status");

CREATE UNIQUE INDEX "listings_homepageProjectSlot_project_unique"
ON "listings"("homepageProjectSlot")
WHERE "isProject" = true AND "homepageProjectSlot" IS NOT NULL;
