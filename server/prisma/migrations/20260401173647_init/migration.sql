-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "paymentTypes" SET DEFAULT ARRAY['cash', 'invoice', 'paypal']::TEXT[];

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "description" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "description" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "description" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "description" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Text" ADD COLUMN     "description" TEXT DEFAULT '';
