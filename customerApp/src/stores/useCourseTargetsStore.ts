import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { CourseTarget } from "../types";

const initialCourseTargets: CourseTarget[] = [
  {
    id: "895aa302-63d8-4af2-b97f-b0dde91375bf",
    seq: 1,
    name: "Hip Hop",
    color: "bg-pink-400",
    isActive: true,
  },
  {
    id: "a366b74b-9665-439e-92cf-5919d79a8ec0",
    seq: 2,
    name: "Salsa",
    color: "bg-blue-400",
    isActive: true,
  },
  {
    id: "f32bc2e9-5c8f-4047-9a22-4b168298d1d4",
    seq: 3,
    name: "Ballet",
    color: "bg-purple-400",
    isActive: true,
  },
  {
    id: "0e1d5c18-32aa-4c20-97fb-b15141767ab3",
    seq: 4,
    name: "Contemporary",
    color: "bg-green-400",
    isActive: true,
  },
  {
    id: "5cf7e48b-d0d0-4d37-9c03-42ebcd1ac2f3",
    seq: 5,
    name: "Jazz",
    color: "bg-yellow-400",
    isActive: true,
  },
  {
    id: "3eb39bcb-d89d-4725-b259-7fbd80e317af",
    seq: 6,
    name: "Tango",
    color: "bg-red-400",
    isActive: true,
  },
  {
    id: "44c5b27c-d9aa-4a80-b0ef-6f72a3711cb5",
    seq: 7,
    name: "Breakdance",
    color: "bg-teal-400",
    isActive: true,
  },
];

const withUpdatedSeq = (courseTargets: CourseTarget[]) => {
  return courseTargets.map((courseTarget, index) => ({
    ...courseTarget,
    seq: index + 1,
  }));
};

const sortCourseTargetsByActive = (courseTargets: CourseTarget[]) => {
  const activeCourses = courseTargets.filter((course) => course.isActive);
  const inactiveCourses = courseTargets.filter((course) => !course.isActive);

  return withUpdatedSeq([...activeCourses, ...inactiveCourses]);
};

type CourseTargetsStore = {
  courseTargets: CourseTarget[];
  setCourseTargets: (updater: (prev: CourseTarget[]) => CourseTarget[]) => void;
  toggleCourseTargetActive: (id: string, isActive: boolean) => void;
  reorderCourseTargets: (activeId: string, overId: string) => void;
};

export const useCourseTargetsStore = create<CourseTargetsStore>()(
  persist(
    (set) => ({
      courseTargets: withUpdatedSeq(sortCourseTargetsByActive(initialCourseTargets)),

      setCourseTargets: (updater) =>
        set((state) => ({
          courseTargets: withUpdatedSeq(updater(state.courseTargets)),
        })),

      toggleCourseTargetActive: (id, isActive) =>
        set((state) => {
          const updated = state.courseTargets.map((course) =>
            course.id === id ? { ...course, isActive } : course,
          );

          return {
            courseTargets: sortCourseTargetsByActive(updated),
          };
        }),

      reorderCourseTargets: (activeId, overId) =>
        set((state) => {
          const activeItem = state.courseTargets.find((item) => item.id === activeId);
          const overItem = state.courseTargets.find((item) => item.id === overId);

          if (!activeItem || !overItem) return state;
          if (!activeItem.isActive || !overItem.isActive) return state;

          const activeCourses = state.courseTargets.filter((item) => item.isActive);
          const inactiveCourses = state.courseTargets.filter((item) => !item.isActive);

          const oldIndex = activeCourses.findIndex((item) => item.id === activeId);
          const newIndex = activeCourses.findIndex((item) => item.id === overId);

          const reorderedActiveCourses = arrayMove(activeCourses, oldIndex, newIndex);

          return {
            courseTargets: withUpdatedSeq([...reorderedActiveCourses, ...inactiveCourses]),
          };
        }),
    }),
    {
      name: "courseTargets-storage",
    },
  ),
);
