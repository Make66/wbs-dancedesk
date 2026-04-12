import { z } from 'zod/v4';

export const attendanceStatusSchema = z.enum(['PRESENT', 'ABSENT', 'EXCUSED']);

export const attendanceSchema = z.object({
  date:          z.iso.datetime(),
  status:        attendanceStatusSchema.default('PRESENT').optional(),
  comment:       z.string().optional(),
  participantId: z.uuid('Participant ID must be a UUID'),
  courseId:      z.uuid('Course ID must be a UUID'),
});

export type Attendance = z.infer<typeof attendanceSchema>;
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
