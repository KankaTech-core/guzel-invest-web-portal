-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'REMOVED');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'PENTHOUSE', 'LAND', 'COMMERCIAL', 'OFFICE', 'SHOP', 'FARM');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SYNCING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "PropertyType" NOT NULL,
    "saleType" "SaleType" NOT NULL,
    "company" TEXT NOT NULL DEFAULT 'Güzel Invest',
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "neighborhood" TEXT,
    "address" TEXT,
    "googleMapsLink" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "area" INTEGER NOT NULL,
    "rooms" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "wcCount" INTEGER,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "buildYear" INTEGER,
    "heating" TEXT,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "garden" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "elevator" BOOLEAN NOT NULL DEFAULT false,
    "security" BOOLEAN NOT NULL DEFAULT false,
    "seaView" BOOLEAN NOT NULL DEFAULT false,
    "parcelNo" TEXT,
    "emsal" DOUBLE PRECISION,
    "zoningStatus" TEXT,
    "groundFloorArea" INTEGER,
    "basementArea" INTEGER,
    "hasWaterSource" BOOLEAN NOT NULL DEFAULT false,
    "hasFruitTrees" BOOLEAN NOT NULL DEFAULT false,
    "existingStructure" TEXT,
    "citizenshipEligible" BOOLEAN NOT NULL DEFAULT false,
    "residenceEligible" BOOLEAN NOT NULL DEFAULT false,
    "publishToHepsiemlak" BOOLEAN NOT NULL DEFAULT false,
    "publishToSahibinden" BOOLEAN NOT NULL DEFAULT false,
    "showOnHomepageHero" BOOLEAN NOT NULL DEFAULT false,
    "homepageHeroSlot" INTEGER,
    "aiTags" TEXT[],
    "aiProcessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "deliveryDate" TEXT,
    "isProject" BOOLEAN NOT NULL DEFAULT false,
    "projectType" TEXT,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImageUrl" TEXT,
    "coverThumbnailUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_company_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_company_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_serials" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_serials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#EC6803',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_tags" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "listing_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_translations" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[],

    CONSTRAINT "listing_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "aiTags" TEXT[],
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "customGalleryId" TEXT,
    "projectUnitId" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'sahibinden',
    "action" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "externalId" TEXT,
    "errorMessage" TEXT,
    "requestData" JSONB,
    "responseData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_jobs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'csv',
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "filters" JSONB,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "rowCount" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "export_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "listingId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'tr',
    "source" TEXT NOT NULL DEFAULT 'website',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_feedback_threads" (
    "id" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "anchorX" DOUBLE PRECISION NOT NULL,
    "anchorY" DOUBLE PRECISION NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "hiddenAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_feedback_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_feedback_messages" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_feedback_messages_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "listings_slug_key" ON "listings"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "listings_sku_key" ON "listings"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "listings_homepageHeroSlot_key" ON "listings"("homepageHeroSlot");

-- CreateIndex
CREATE INDEX "listings_status_idx" ON "listings"("status");

-- CreateIndex
CREATE INDEX "listings_type_idx" ON "listings"("type");

-- CreateIndex
CREATE INDEX "listings_saleType_idx" ON "listings"("saleType");

-- CreateIndex
CREATE INDEX "listings_sku_idx" ON "listings"("sku");

-- CreateIndex
CREATE INDEX "listings_city_district_idx" ON "listings"("city", "district");

-- CreateIndex
CREATE INDEX "listings_price_idx" ON "listings"("price");

-- CreateIndex
CREATE INDEX "listings_showOnHomepageHero_status_idx" ON "listings"("showOnHomepageHero", "status");

-- CreateIndex
CREATE INDEX "listings_homepageHeroSlot_status_idx" ON "listings"("homepageHeroSlot", "status");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_createdAt_idx" ON "articles"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "listing_company_options_name_key" ON "listing_company_options"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "listing_tags_listingId_tagId_key" ON "listing_tags"("listingId", "tagId");

-- CreateIndex
CREATE INDEX "listing_translations_locale_idx" ON "listing_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "listing_translations_listingId_locale_key" ON "listing_translations"("listingId", "locale");

-- CreateIndex
CREATE INDEX "media_listingId_order_idx" ON "media"("listingId", "order");

-- CreateIndex
CREATE INDEX "sync_logs_listingId_idx" ON "sync_logs"("listingId");

-- CreateIndex
CREATE INDEX "sync_logs_status_idx" ON "sync_logs"("status");

-- CreateIndex
CREATE INDEX "export_jobs_status_idx" ON "export_jobs"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_read_idx" ON "contact_submissions"("read");

-- CreateIndex
CREATE INDEX "site_feedback_threads_pagePath_hidden_idx" ON "site_feedback_threads"("pagePath", "hidden");

-- CreateIndex
CREATE INDEX "site_feedback_threads_updatedAt_idx" ON "site_feedback_threads"("updatedAt");

-- CreateIndex
CREATE INDEX "site_feedback_messages_threadId_createdAt_idx" ON "site_feedback_messages"("threadId", "createdAt");

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
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_tags" ADD CONSTRAINT "listing_tags_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_tags" ADD CONSTRAINT "listing_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_translations" ADD CONSTRAINT "listing_translations_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_customGalleryId_fkey" FOREIGN KEY ("customGalleryId") REFERENCES "custom_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_projectUnitId_fkey" FOREIGN KEY ("projectUnitId") REFERENCES "project_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_jobs" ADD CONSTRAINT "export_jobs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_feedback_threads" ADD CONSTRAINT "site_feedback_threads_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_feedback_messages" ADD CONSTRAINT "site_feedback_messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_feedback_messages" ADD CONSTRAINT "site_feedback_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "site_feedback_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

