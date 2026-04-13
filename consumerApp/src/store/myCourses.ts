import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Course = {
  id: string;
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  frequency: string;
  clubRepetition:  number;
  courseRepetition: number; 
  dates: { date: string; isStart: boolean }[];
  color: string[];
  isClub: boolean;
  [key: string]: unknown;
};

type MyCoursesState = {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  clearCourses: () => void;
};

export const useMyCoursesStore = create<MyCoursesState>()(
  devtools( 
  (set) => ({
    courses: [],
    setCourses: (courses) => set({ courses }),
    clearCourses: () => set({ courses: [] }),
  }),
  { name: 'myCoursesStore'}
));
