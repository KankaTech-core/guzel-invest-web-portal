-- AlterTable: Convert imageUrl to imageUrls array
-- First add the new column
ALTER TABLE "floor_plans" ADD COLUMN "imageUrls" TEXT[];

-- Migrate existing data: convert single imageUrl to array
UPDATE "floor_plans" SET "imageUrls" = ARRAY["imageUrl"] WHERE "imageUrl" IS NOT NULL AND "imageUrl" != '';
UPDATE "floor_plans" SET "imageUrls" = '{}' WHERE "imageUrls" IS NULL;

-- Drop the old column
ALTER TABLE "floor_plans" DROP COLUMN "imageUrl";
