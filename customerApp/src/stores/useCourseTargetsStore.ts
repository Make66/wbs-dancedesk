import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { CourseTarget } from "../types/course";

type CreateCourseTargetInput = {
  locationId: string;
  tenantId?: string;
  name?: string;
  color?: string[];
  icon?: string;
};

type UpdateCourseTargetInput = {
  name?: string;
  color?: string[];
  icon?: string;
};

type CourseTargetsStore = {
  courseTargets: CourseTarget[];
  isInactiveVisible: boolean;
  isLoading: boolean;
  error: string | null;

  toggleInactiveVisibility: () => void;

  setCourseTargets: (targets: CourseTarget[]) => void;
  replaceCourseTargets: (targets: CourseTarget[]) => void;
  clearCourseTargets: () => void;

  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;

  getVisibleCourseTargets: () => CourseTarget[];

  toggleCourseTargetActive: (id: string, active: boolean) => void;
  reorderCourseTargets: (activeId: string, overId: string) => void;
  addCourseTarget: (input: CreateCourseTargetInput) => void;
  deleteCourseTarget: (id: string) => void;
  updateCourseTarget: (id: string, data: UpdateCourseTargetInput) => void;
  updateColor: (id: string, color: string[]) => void;
};

const filterNotDeleted = <T extends { isDeleted: boolean }>(items: T[]) => {
  return items.filter((item) => !item.isDeleted);
};

const sortBySeq = <T extends { seq: number }>(items: T[]) => {
  return [...items].sort((a, b) => a.seq - b.seq);
};

const withUpdatedSeq = (courseTargets: CourseTarget[]) => {
  return courseTargets.map((courseTarget, index) => ({
    ...courseTarget,
    seq: index + 1,
  }));
};

const sortCourseTargetsByActive = (courseTargets: CourseTarget[]) => {
  const sorted = sortBySeq(courseTargets);
  const activeCourses = sorted.filter((course) => course.active);
  const inactiveCourses = sorted.filter((course) => !course.active);

  return withUpdatedSeq([...activeCourses, ...inactiveCourses]);
};

export const useCourseTargetsStore = create<CourseTargetsStore>()(
  persist(
    (set, get) => ({
      courseTargets: [],
      isInactiveVisible: false,
      isLoading: false,
      error: null,

      toggleInactiveVisibility: () =>
        set((state) => ({
          isInactiveVisible: !state.isInactiveVisible,
        })),

      setCourseTargets: (targets) =>
        set((state) => ({
          courseTargets: sortBySeq(
            filterNotDeleted([
              ...state.courseTargets.filter((item) => !targets.some((t) => t.id === item.id)),
              ...targets,
            ]),
          ),
          error: null,
        })),

      replaceCourseTargets: (targets) =>
        set({
          courseTargets: sortBySeq(filterNotDeleted(targets)),
          error: null,
        }),

      clearCourseTargets: () =>
        set({
          courseTargets: [],
          isLoading: false,
          error: null,
        }),

      setLoading: (value) =>
        set({
          isLoading: value,
        }),

      setError: (value) =>
        set({
          error: value,
        }),

      getVisibleCourseTargets: () => {
        const { courseTargets, isInactiveVisible } = get();

        const visibleTargets = isInactiveVisible
          ? courseTargets
          : courseTargets.filter((item) => item.active);

        return sortBySeq(visibleTargets);
      },

      toggleCourseTargetActive: (id, active) =>
        set((state) => {
          const updated = state.courseTargets.map((courseTarget) =>
            courseTarget.id === id
              ? {
                  ...courseTarget,
                  active,
                  updatedAt: new Date().toISOString(),
                }
              : courseTarget,
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
          if (!activeItem.active || !overItem.active) return state;

          const activeCourses = sortBySeq(state.courseTargets.filter((item) => item.active));
          const inactiveCourses = sortBySeq(state.courseTargets.filter((item) => !item.active));

          const oldIndex = activeCourses.findIndex((item) => item.id === activeId);
          const newIndex = activeCourses.findIndex((item) => item.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const reorderedActiveCourses = arrayMove(activeCourses, oldIndex, newIndex);

          return {
            courseTargets: withUpdatedSeq([...reorderedActiveCourses, ...inactiveCourses]).map(
              (item) =>
                item.id === activeId || item.id === overId
                  ? { ...item, updatedAt: new Date().toISOString() }
                  : item,
            ),
          };
        }),

      addCourseTarget: (input) =>
        set((state) => {
          const nextSeq = state.courseTargets.length + 1;

          const newCourseTarget: CourseTarget = {
            id: crypto.randomUUID(),
            seq: nextSeq,
            name: input.name?.trim() || "Neue Zielgruppe",
            color: input.color || ["#9ca3af", "#9ca3af"],
            icon: input.icon || "",
            active: true,
            locationId: input.locationId,
            tenantId: input.tenantId || "seed",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
          };

          const activeCourses = state.courseTargets.filter((item) => item.active);
          const inactiveCourses = state.courseTargets.filter((item) => !item.active);

          return {
            courseTargets: withUpdatedSeq([
              newCourseTarget,
              ...sortBySeq(activeCourses),
              ...sortBySeq(inactiveCourses),
            ]),
          };
        }),

      updateCourseTarget: (id, data) =>
        set((state) => ({
          courseTargets: state.courseTargets.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),

      updateColor: (id, color) =>
        set((state) => ({
          courseTargets: state.courseTargets.map((item) =>
            item.id === id
              ? {
                  ...item,
                  color,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),

      deleteCourseTarget: (id) =>
        set((state) => ({
          courseTargets: withUpdatedSeq(
            state.courseTargets.filter((courseTarget) => courseTarget.id !== id),
          ),
        })),
    }),
    {
      name: "courseTargets-ui-storage",
      partialize: (state) => ({
        isInactiveVisible: state.isInactiveVisible,
      }),
    },
  ),
);
