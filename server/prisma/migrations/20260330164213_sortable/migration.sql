/*
  Warnings:

  - You are about to drop the column `seq` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `seq` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `seq` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "seq",
ADD COLUMN     "setSeqCourse" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "setSeqInstructor" JSONB DEFAULT '{}',
ADD COLUMN     "setSeqTarget" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY['Salsa', 'WTP', 'HipHop']::TEXT[];

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "seq",
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "setSeqTarget" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "seq",
ADD COLUMN     "setSeqCat" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "settings",
ADD COLUMN     "setSeqCategory" JSONB DEFAULT '{}',
ADD COLUMN     "setSeqCourse" JSONB DEFAULT '{}',
ADD COLUMN     "setSeqTarget" JSONB DEFAULT '{}';

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
