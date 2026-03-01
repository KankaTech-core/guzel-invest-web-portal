-- AlterTable
ALTER TABLE "project_units" ADD COLUMN IF NOT EXISTS "detailType" TEXT NOT NULL DEFAULT 'ROOM';
