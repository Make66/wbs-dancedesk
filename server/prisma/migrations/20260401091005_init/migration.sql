/*
  Warnings:

  - You are about to drop the column `seq` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "seq",
ADD COLUMN     "description" TEXT DEFAULT '',
ADD COLUMN     "isClub" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numberOfDates" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "federalState" TEXT,
ADD COLUMN     "schoolHolidays" JSONB;

-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "description" TEXT DEFAULT '';
