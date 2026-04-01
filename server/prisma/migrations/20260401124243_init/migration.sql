-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT DEFAULT 'Paare Grundkurs',
    "description" TEXT DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "color" TEXT[] DEFAULT ARRAY['#000000', '#FFFFFF']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "setSeqCourse" UUID[],
    "targetId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "name" TEXT DEFAULT 'Grundkurs 1',
    "description" TEXT DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isClub" BOOLEAN NOT NULL DEFAULT false,
    "repeat" INTEGER NOT NULL DEFAULT 0,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "isIgnoreCalendar" BOOLEAN NOT NULL DEFAULT false,
    "numberOfDates" INTEGER NOT NULL DEFAULT 1,
    "dates" JSONB NOT NULL DEFAULT '[]',
    "seatsCurrent" INTEGER NOT NULL DEFAULT 20,
    "seatsMax" INTEGER NOT NULL DEFAULT 20,
    "paymentTypes" TEXT[] DEFAULT ARRAY['bar', 'paypal', 'bank']::TEXT[],
    "contractTypes" TEXT[] DEFAULT ARRAY['standard', 'trial']::TEXT[],
    "categoryId" UUID NOT NULL,
    "instructorId" UUID,
    "roomId" UUID,
    "textTermsId" UUID,
    "textInfoId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "name" TEXT NOT NULL DEFAULT 'DanceSchool Flip''n Bit',
    "email" TEXT NOT NULL DEFAULT 'noreply@email.de',
    "website" TEXT NOT NULL DEFAULT 'https://www.wbscodingschool.com',
    "logoUrl" TEXT NOT NULL DEFAULT './assets/images/logo.webp',
    "primary" TEXT NOT NULL DEFAULT '#B5252B',
    "secondary" TEXT NOT NULL DEFAULT '#858384',
    "tertiary" TEXT NOT NULL DEFAULT '#858384',
    "quaternary" TEXT NOT NULL DEFAULT '#858384',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "setSeqInstructor" UUID[],
    "setSeqTarget" UUID[],
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Any town',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "name" TEXT DEFAULT 'John Doe Instructor',
    "imageUrl" TEXT NOT NULL DEFAULT './assets/images/no-profile-picture',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "skills" TEXT[] DEFAULT ARRAY['Salsa', 'WTP', 'HipHop']::TEXT[],
    "customerId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "name" TEXT DEFAULT 'John Doe Instructor',
    "imageUrl" TEXT NOT NULL DEFAULT './assets/images/no-profile-picture',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "setSeqTarget" UUID[],
    "customerId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "name" TEXT NOT NULL DEFAULT 'Standard Modul',
    "color" TEXT NOT NULL DEFAULT '#B5252B',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "firstName" TEXT DEFAULT 'Room 1',
    "lastName" TEXT DEFAULT 'Room 1',
    "email" TEXT DEFAULT 'Room 1',
    "phone" TEXT DEFAULT 'Room 1',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "name" TEXT DEFAULT 'Room 1',
    "imageUrl" TEXT NOT NULL DEFAULT './assets/images/no-profile-picture',
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "colTitles" JSONB,
    "holidays" JSONB,
    "schoolHolidays" JSONB,
    "rebates" JSONB,
    "voucher" JSONB,
    "calendarPast" BOOLEAN NOT NULL DEFAULT false,
    "calendarOccurrences" INTEGER NOT NULL DEFAULT 0,
    "calendarLength" INTEGER NOT NULL DEFAULT 12,
    "formFields" JSONB,
    "domain" TEXT,
    "federalState" TEXT,
    "legalResources" TEXT NOT NULL DEFAULT 'https://domain/fileadmin/kunden/mandant/rechtstexte/',
    "contracts" JSONB,
    "registration" JSONB,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "name" TEXT DEFAULT 'Erwachsene',
    "description" TEXT DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "color" TEXT[] DEFAULT ARRAY['#000000', '#FFFFFF']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "setSeqCategory" UUID[],
    "locationId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text" (
    "name" TEXT DEFAULT 'Erwachsene',
    "type" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT NOT NULL DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "firstName" TEXT DEFAULT 'John Doe',
    "lastName" TEXT DEFAULT 'Doe',
    "email" TEXT NOT NULL DEFAULT 'admin@test.de',
    "password" TEXT NOT NULL DEFAULT 'Test123!',
    "imageUrl" TEXT NOT NULL DEFAULT './assets/images/no-profile-picture',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "refreshToken" TEXT,
    "settings" JSONB DEFAULT '{}',
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserLocations" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserLocations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserModules" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserModules_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_tenantId_key" ON "Settings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_UserLocations_B_index" ON "_UserLocations"("B");

-- CreateIndex
CREATE INDEX "_UserModules_B_index" ON "_UserModules"("B");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textTermsId_fkey" FOREIGN KEY ("textTermsId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textInfoId_fkey" FOREIGN KEY ("textInfoId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLocations" ADD CONSTRAINT "_UserLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLocations" ADD CONSTRAINT "_UserLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserModules" ADD CONSTRAINT "_UserModules_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserModules" ADD CONSTRAINT "_UserModules_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
