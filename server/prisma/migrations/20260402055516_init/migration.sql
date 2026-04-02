-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_textInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_textTermsId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "textTermsId" DROP NOT NULL,
ALTER COLUMN "textInfoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textTermsId_fkey" FOREIGN KEY ("textTermsId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textInfoId_fkey" FOREIGN KEY ("textInfoId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;
