-- AlterTable
ALTER TABLE "contact_submissions"
ADD COLUMN "surname" TEXT,
ADD COLUMN "projectSlug" TEXT,
ADD COLUMN "projectTitle" TEXT;

-- CreateIndex
CREATE INDEX "contact_submissions_projectSlug_idx" ON "contact_submissions"("projectSlug");
