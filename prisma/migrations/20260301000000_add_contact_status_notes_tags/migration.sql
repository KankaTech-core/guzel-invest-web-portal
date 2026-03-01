-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');

-- AlterTable: Add status and notes to contact_submissions
ALTER TABLE "contact_submissions"
ADD COLUMN "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN "notes" TEXT;

-- CreateTable: contact_submission_tags
CREATE TABLE "contact_submission_tags" (
    "id" TEXT NOT NULL,
    "contactSubmissionId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "contact_submission_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_submission_tags_contactSubmissionId_tagId_key" ON "contact_submission_tags"("contactSubmissionId", "tagId");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- AddForeignKey
ALTER TABLE "contact_submission_tags" ADD CONSTRAINT "contact_submission_tags_contactSubmissionId_fkey" FOREIGN KEY ("contactSubmissionId") REFERENCES "contact_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_submission_tags" ADD CONSTRAINT "contact_submission_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
