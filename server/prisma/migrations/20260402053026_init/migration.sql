/*
  Warnings:

  - You are about to drop the column `active` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfDates` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `repeat` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Instructor` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Target` table. All the data in the column will be lost.
  - Made the column `textTermsId` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `textInfoId` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_textInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_textTermsId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "active",
DROP COLUMN "numberOfDates",
DROP COLUMN "repeat",
ADD COLUMN     "clubRepetition" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "courseRepetition" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isBookedOut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTaxFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "options" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "textTermsId" SET NOT NULL,
ALTER COLUMN "textInfoId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Instructor" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textTermsId_fkey" FOREIGN KEY ("textTermsId") REFERENCES "Text"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textInfoId_fkey" FOREIGN KEY ("textInfoId") REFERENCES "Text"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
