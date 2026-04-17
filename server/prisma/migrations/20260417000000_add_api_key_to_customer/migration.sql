ALTER TABLE "Customer" ADD COLUMN "apiKey" TEXT NOT NULL DEFAULT '';

-- Give existing rows a unique placeholder so the unique constraint doesn't fail
UPDATE "Customer" SET "apiKey" = gen_random_uuid()::text WHERE "apiKey" = '';

CREATE UNIQUE INDEX "Customer_apiKey_key" ON "Customer"("apiKey");
