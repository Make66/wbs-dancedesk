-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "icon" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Settings" (
    "colTitles" JSONB,
    "holidays" JSONB,
    "rebates" JSONB,
    "voucher" JSONB,
    "calendarPast" BOOLEAN NOT NULL DEFAULT false,
    "calendarOccurrences" INTEGER NOT NULL DEFAULT 0,
    "calendarLength" INTEGER NOT NULL DEFAULT 12,
    "formFields" JSONB,
    "domain" TEXT,
    "legalResources" TEXT NOT NULL DEFAULT 'https://domain/fileadmin/kunden/mandant/rechtstexte/',
    "contracts" JSONB,
    "registration" JSONB,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_tenantId_key" ON "Settings"("tenantId");
