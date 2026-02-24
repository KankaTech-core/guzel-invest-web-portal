-- CreateTable
CREATE TABLE "homepage_settings" (
    "id" TEXT NOT NULL,
    "heroVideoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homepage_settings_pkey" PRIMARY KEY ("id")
);
