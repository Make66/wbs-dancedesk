-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT DEFAULT 'Paare Grundkurs',
    "targetId" TEXT NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT[] DEFAULT ARRAY['#000000', '#FFFFFF']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "name" TEXT DEFAULT 'Grundkurs 1',
    "categoryId" TEXT NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repeat" INTEGER NOT NULL DEFAULT 0,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "roomId" TEXT,
    "isIgnoreCalendar" BOOLEAN NOT NULL DEFAULT false,
    "dates" JSONB NOT NULL DEFAULT '[]',
    "seatsCurrent" INTEGER NOT NULL DEFAULT 20,
    "seatsMax" INTEGER NOT NULL DEFAULT 20,
    "paymentTypes" TEXT[] DEFAULT ARRAY['bar', 'paypal', 'bank']::TEXT[],
    "contractTypes" TEXT[] DEFAULT ARRAY['standard', 'trial']::TEXT[],
    "instructorId" TEXT,
    "textTermsId" TEXT,
    "textInfoId" TEXT,
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "textId" TEXT,

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
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Any town',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" TEXT NOT NULL,
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
    "id" TEXT NOT NULL,
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
    "seq" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "name" TEXT NOT NULL DEFAULT 'Module 1',
    "seq" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#B5252B',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" TEXT NOT NULL,
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
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" TEXT NOT NULL,
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
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "name" TEXT DEFAULT 'Erwachsene',
    "icon" TEXT NOT NULL DEFAULT '',
    "seq" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT[] DEFAULT ARRAY['#000000', '#FFFFFF']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" TEXT NOT NULL,
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
    "id" TEXT NOT NULL,
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
    "modules" TEXT[] DEFAULT ARRAY['ALL']::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textTermsId_fkey" FOREIGN KEY ("textTermsId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textInfoId_fkey" FOREIGN KEY ("textInfoId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;
