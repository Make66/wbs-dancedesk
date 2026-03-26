import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { CourseTarget } from "../types";

const initialCourseTargets: CourseTarget[] = [
  {
    id: "895aa302-63d8-4af2-b97f-b0dde91375bf",
    seq: 1,
    name: "Hip Hop",
    color: "#f472b6",
    isActive: true,
  },
  {
    id: "a366b74b-9665-439e-92cf-5919d79a8ec0",
    seq: 2,
    name: "Salsa",
    color: "#60a5fa",
    isActive: true,
  },
  {
    id: "f32bc2e9-5c8f-4047-9a22-4b168298d1d4",
    seq: 3,
    name: "Ballet",
    color: "#c084fc",
    isActive: true,
  },
  {
    id: "0e1d5c18-32aa-4c20-97fb-b15141767ab3",
    seq: 4,
    name: "Contemporary",
    color: "#4ade80",
    isActive: true,
  },
  {
    id: "5cf7e48b-d0d0-4d37-9c03-42ebcd1ac2f3",
    seq: 5,
    name: "Jazz",
    color: "#facc15",
    isActive: true,
  },
  {
    id: "3eb39bcb-d89d-4725-b259-7fbd80e317af",
    seq: 6,
    name: "Tango",
    color: "#f87171",
    isActive: true,
  },
  {
    id: "44c5b27c-d9aa-4a80-b0ef-6f72a3711cb5",
    seq: 7,
    name: "Breakdance",
    color: "#2dd4bf",
    isActive: true,
  },
];

type CreateCourseTargetInput = {
  name?: string;
  color?: string;
};

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
  isInactiveVisible: boolean;
  toggleInactiveVisibility: () => void;
  setCourseTargets: (updater: (prev: CourseTarget[]) => CourseTarget[]) => void;
  toggleCourseTargetActive: (id: string, isActive: boolean) => void;
  reorderCourseTargets: (activeId: string, overId: string) => void;
  addCourseTarget: (input?: CreateCourseTargetInput) => void;
  deleteCourseTarget: (id: string) => void;
  updateCourseTarget: (id: string, data: { name: string; color: string }) => void;
  updateColor: (id: string, color: string) => void;
};

export const useCourseTargetsStore = create<CourseTargetsStore>()(
  persist(
    (set) => ({
      courseTargets: withUpdatedSeq(sortCourseTargetsByActive(initialCourseTargets)),
      isInactiveVisible: false,

      toggleInactiveVisibility: () =>
        set((state) => ({
          isInactiveVisible: !state.isInactiveVisible,
        })),

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

      addCourseTarget: (input) =>
        set((state) => {
          const newCourseTarget: CourseTarget = {
            id: crypto.randomUUID(),
            seq: state.courseTargets.length + 1,
            name: input?.name?.trim() || "Neue Zielgruppe",
            color: input?.color || "#9ca3af",
            isActive: true,
          };

          const activeCourses = state.courseTargets.filter((item) => item.isActive);
          const inactiveCourses = state.courseTargets.filter((item) => !item.isActive);

          return {
            courseTargets: withUpdatedSeq([newCourseTarget, ...activeCourses, ...inactiveCourses]),
          };
        }),

      updateCourseTarget: (id, data) =>
        set((state) => ({
          courseTargets: state.courseTargets.map((item) =>
            item.id === id ? { ...item, ...data } : item,
          ),
        })),

      updateColor: (id, color) =>
        set((state) => ({
          courseTargets: state.courseTargets.map((item) =>
            item.id === id ? { ...item, color } : item,
          ),
        })),

      deleteCourseTarget: (id) =>
        set((state) => ({
          courseTargets: withUpdatedSeq(
            state.courseTargets.filter((courseTarget) => courseTarget.id !== id),
          ),
        })),

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
