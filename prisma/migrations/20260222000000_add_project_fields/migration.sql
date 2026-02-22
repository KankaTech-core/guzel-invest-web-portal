-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'DOCUMENT';

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "deliveryDate" TEXT,
ADD COLUMN     "isProject" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "projectType" TEXT;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "category" TEXT,
ADD COLUMN     "customGalleryId" TEXT,
ADD COLUMN     "projectUnitId" TEXT;

-- CreateTable
CREATE TABLE "project_features" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_feature_translations" (
    "id" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "project_feature_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_galleries" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "custom_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_gallery_translations" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,

    CONSTRAINT "custom_gallery_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_units" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "rooms" TEXT NOT NULL,
    "area" INTEGER,
    "price" DECIMAL(65,30),

    CONSTRAINT "project_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_unit_translations" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "project_unit_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floor_plans" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "area" TEXT,

    CONSTRAINT "floor_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floor_plan_translations" (
    "id" TEXT NOT NULL,
    "floorPlanId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "floor_plan_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_faqs" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "listing_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_faq_translations" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "listing_faq_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_feature_translations_featureId_locale_key" ON "project_feature_translations"("featureId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "custom_gallery_translations_galleryId_locale_key" ON "custom_gallery_translations"("galleryId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "project_unit_translations_unitId_locale_key" ON "project_unit_translations"("unitId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "floor_plan_translations_floorPlanId_locale_key" ON "floor_plan_translations"("floorPlanId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "listing_faq_translations_faqId_locale_key" ON "listing_faq_translations"("faqId", "locale");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_customGalleryId_fkey" FOREIGN KEY ("customGalleryId") REFERENCES "custom_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_projectUnitId_fkey" FOREIGN KEY ("projectUnitId") REFERENCES "project_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_features" ADD CONSTRAINT "project_features_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_feature_translations" ADD CONSTRAINT "project_feature_translations_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "project_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_galleries" ADD CONSTRAINT "custom_galleries_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_gallery_translations" ADD CONSTRAINT "custom_gallery_translations_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "custom_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_units" ADD CONSTRAINT "project_units_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_unit_translations" ADD CONSTRAINT "project_unit_translations_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "project_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plans" ADD CONSTRAINT "floor_plans_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floor_plan_translations" ADD CONSTRAINT "floor_plan_translations_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "floor_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_faqs" ADD CONSTRAINT "listing_faqs_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_faq_translations" ADD CONSTRAINT "listing_faq_translations_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "listing_faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

