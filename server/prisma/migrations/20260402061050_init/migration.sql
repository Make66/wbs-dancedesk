/*
  Warnings:

  - Made the column `customerId` on table `Instructor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_customerId_fkey";

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "customerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
