import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type CourseWeekEntry = {
  id: string;
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  isClub: boolean;
  isBookedOut: boolean;
  seatsCurrent: number;
  seatsMax: number;
  options: number;
  instructor: { id: string; firstName: string; lastName: string } | null;
  room: { id: string; name: string; description: string } | null;
  category: { id: string; name: string; color: string[] } | null;
  target: { id: string; name: string; color: string[] } | null;
  color: string[];
};

// Keys 0–6 = Mon–Sun
export type CourseWeek = Record<string, CourseWeekEntry[]>;

type CourseWeekState = {
  courseWeek: CourseWeek | null;
  setCourseWeek: (courseWeek: CourseWeek) => void;
  clearCourseWeek: () => void;
};

export const useCourseWeekStore = create<CourseWeekState>()(
  devtools(
    (set) => ({
      courseWeek: null,
      setCourseWeek: (courseWeek) => set({ courseWeek }),
      clearCourseWeek: () => set({ courseWeek: null }),
    }),
    { name: 'courseWeekStore' }
  )
);
