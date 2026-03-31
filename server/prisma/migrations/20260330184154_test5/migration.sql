/*
  Warnings:

  - You are about to drop the column `seq` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `setSeqCat` on the `Target` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "seq";

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "setSeqCat",
ADD COLUMN     "setSeqCategory" JSONB DEFAULT '{}';
