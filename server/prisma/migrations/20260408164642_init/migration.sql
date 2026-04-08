-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "calendarConfig" JSONB DEFAULT '{"startHour": 10, "endHour": 20, "slotHeight": 20, "minutesPerSlot": 15}';
