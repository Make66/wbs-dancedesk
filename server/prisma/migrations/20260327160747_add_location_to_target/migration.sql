-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "locationId" TEXT;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
