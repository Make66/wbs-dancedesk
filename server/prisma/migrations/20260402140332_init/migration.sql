-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "setSeqCourse" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "setSeqCourse" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "icon" TEXT DEFAULT '';
