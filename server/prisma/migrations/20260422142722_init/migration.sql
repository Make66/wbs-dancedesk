-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');

-- CreateTable
CREATE TABLE "Attendance" (
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "comment" TEXT DEFAULT '',
    "participantId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT DEFAULT 'Paare Grundkurs',
    "description" TEXT DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "color" TEXT[] DEFAULT ARRAY['#000000', '#FFFFFF']::TEXT[],
    "setSeqCourse" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "participantId" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "domain" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "sessionId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "name" TEXT DEFAULT 'Grundkurs 1',
    "description" TEXT DEFAULT '',
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "clubRepetition" INTEGER NOT NULL DEFAULT 50,
    "courseRepetition" INTEGER NOT NULL DEFAULT 8,
    "dates" JSONB NOT NULL DEFAULT '[]',
    "contracts" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "options" INTEGER NOT NULL DEFAULT 0,
    "seatsCurrent" INTEGER NOT NULL DEFAULT 20,
    "seatsMax" INTEGER NOT NULL DEFAULT 20,
    "color" JSONB DEFAULT '[]',
    "isBookedOut" BOOLEAN NOT NULL DEFAULT false,
    "isClub" BOOLEAN NOT NULL DEFAULT false,
    "isIgnoreCalendar" BOOLEAN NOT NULL DEFAULT false,
    "isTaxFree" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" UUID NOT NULL,
    "instructorId" UUID,
    "locationId" UUID,
    "roomId" UUID,
    "textTermsId" UUID,
    "textInfoId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "name" TEXT NOT NULL DEFAULT 'DanceSchool Flip''n Bit',
    "email" TEXT NOT NULL DEFAULT 'noreply@email.de',
    "website" TEXT NOT NULL DEFAULT 'https://www.wbscodingschool.com',
    "logoUrl" TEXT NOT NULL DEFAULT 'https://gui4.kurstool.de/assets/images/logo.webp',
    "primary" TEXT NOT NULL DEFAULT '#B80000',
    "secondary" TEXT NOT NULL DEFAULT '#5F0000',
    "tertiary" TEXT NOT NULL DEFAULT '#565656',
    "quaternary" TEXT NOT NULL DEFAULT '#BABABA',
    "signInKey" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "apiKey" TEXT NOT NULL DEFAULT '',
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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "title" TEXT DEFAULT 'John Doe Instructor',
    "description" TEXT DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '/assets/images/no-profile-picture.svg',
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "color" JSONB DEFAULT '[]',
    "icon" TEXT NOT NULL DEFAULT 'event',
    "type" TEXT NOT NULL DEFAULT 'event',
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "locationId" UUID,
    "roomId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "name" TEXT DEFAULT 'John Doe Instructor',
    "description" TEXT DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'Test123!',
    "refreshToken" TEXT,
    "imageUrl" TEXT NOT NULL DEFAULT '/assets/images/no-profile-picture.svg',
    "skills" TEXT[] DEFAULT ARRAY['Salsa', 'WTP', 'HipHop']::TEXT[],
    "customerId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "name" TEXT DEFAULT 'John Doe Instructor',
    "description" TEXT DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '/assets/images/no-profile-picture.svg',
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "state" TEXT NOT NULL DEFAULT 'State',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "setSeqTarget" UUID[],
    "customerId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "name" TEXT NOT NULL DEFAULT 'Standard Modul',
    "description" TEXT DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#B5252B',
    "icon" TEXT DEFAULT '',
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "news" JSONB DEFAULT '[]',
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "firstName" TEXT DEFAULT 'John',
    "lastName" TEXT DEFAULT 'Doe',
    "email" TEXT DEFAULT 'john.doe@example.com',
    "phone" TEXT DEFAULT '123-456-7890',
    "password" TEXT NOT NULL DEFAULT 'Test123!',
    "imageUrl" TEXT NOT NULL DEFAULT '/assets/images/no-profile-picture.svg',
    "birthDate" TEXT DEFAULT '1990-01-01',
    "gender" TEXT DEFAULT 'other',
    "refreshToken" TEXT,
    "settings" JSONB DEFAULT '{}',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantCourse" (
    "participantId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantCourse_pkey" PRIMARY KEY ("participantId","courseId")
);

-- CreateTable
CREATE TABLE "Post" (
    "title" TEXT DEFAULT '',
    "teaser" TEXT DEFAULT '',
    "text" TEXT DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" UUID,
    "eventId" UUID,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isTopPost" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "firstName" TEXT DEFAULT 'Room 1',
    "lastName" TEXT DEFAULT 'Room 1',
    "email" TEXT DEFAULT 'Room 1',
    "phone" TEXT DEFAULT 'Room 1',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "courseId" UUID NOT NULL,
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
    "description" TEXT DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '/assets/images/no-profile-picture.svg',
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "locationId" UUID,
    "street" TEXT NOT NULL DEFAULT '123 Main St',
    "city" TEXT NOT NULL DEFAULT 'Anytown',
    "zipCode" TEXT NOT NULL DEFAULT '12345',
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "basic" JSONB DEFAULT '{"domain":"","federalState":"","termsUri":"","privacyUri":"","cancellationUri":"", "cancellationSampleUri":""}',
    "calendar" JSONB DEFAULT '{"startHour":10,"endHour":20,"slotHeight":20,"minutesPerSlot":15, "federalHolidays":[], "schoolHolidays":[]}',
    "contracts" JSONB,
    "formFields" JSONB,
    "holidays" JSONB,
    "rebates" JSONB,
    "registration" JSONB DEFAULT '{"titleCol1":"", "titleCol2":"","delTime":90,"checkSeats":false,"waitingList":false,"displayPastNumber":7,"displayNumberOccurrences":7}',
    "terms" JSONB DEFAULT '{"title":"", "content":""}',
    "voucher" JSONB DEFAULT '{"title":"", "content":""}',
    "other" JSONB,
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
    "locationId" UUID,
    "setSeqCategory" UUID[],
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text" (
    "name" TEXT DEFAULT 'Erwachsene',
    "description" TEXT DEFAULT '',
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
    "imageUrl" TEXT NOT NULL DEFAULT '/assets/images/no-profile-picture.svg',
    "refreshToken" TEXT,
    "settings" JSONB DEFAULT '{}',
    "id" UUID NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantCourse" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ParticipantCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventTargets" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EventTargets_AB_pkey" PRIMARY KEY ("A","B")
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
CREATE UNIQUE INDEX "Customer_signInKey_key" ON "Customer"("signInKey");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_code_key" ON "Customer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_apiKey_key" ON "Customer"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_tenantId_key" ON "Settings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_ParticipantCourse_B_index" ON "_ParticipantCourse"("B");

-- CreateIndex
CREATE INDEX "_EventTargets_B_index" ON "_EventTargets"("B");

-- CreateIndex
CREATE INDEX "_UserLocations_B_index" ON "_UserLocations"("B");

-- CreateIndex
CREATE INDEX "_UserModules_B_index" ON "_UserModules"("B");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textTermsId_fkey" FOREIGN KEY ("textTermsId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_textInfoId_fkey" FOREIGN KEY ("textInfoId") REFERENCES "Text"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantCourse" ADD CONSTRAINT "ParticipantCourse_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantCourse" ADD CONSTRAINT "ParticipantCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantCourse" ADD CONSTRAINT "_ParticipantCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantCourse" ADD CONSTRAINT "_ParticipantCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventTargets" ADD CONSTRAINT "_EventTargets_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventTargets" ADD CONSTRAINT "_EventTargets_B_fkey" FOREIGN KEY ("B") REFERENCES "Target"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLocations" ADD CONSTRAINT "_UserLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLocations" ADD CONSTRAINT "_UserLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserModules" ADD CONSTRAINT "_UserModules_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserModules" ADD CONSTRAINT "_UserModules_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
