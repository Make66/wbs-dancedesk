import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { updateEntityById, getItemsForParent } from "../lib/courses/collection-utils";
import type {
  Category,
  Course,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCourseInput,
  UpdateCourseInput,
} from "../types/course-types";
import {
  sortEntitiesByOrderedIds,
  mergeOrderedIds,
  filterNotDeleted,
  sortByActiveStatus,
  sortEntitiesForContext,
} from "../lib/courses/sorting-utils";

type CategoryStore = {
  categories: Category[];
  selectedTargetId: string | null;
  storedOrderedIds: string[];
  expandedCategoryIds: string[];
  isEditMode: boolean;
  isInactiveVisible: boolean;
  isLoading: boolean;
  error: string | null;

  setParentContext: (targetId: string | null, orderedIds?: string[]) => void;
  clearParentContext: () => void;

  setCategories: (categories: Category[]) => void;
  replaceCategories: (categories: Category[], orderedIds?: string[]) => void;
  clearCategories: () => void;

  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditMode: (value: boolean) => void;

  isCategoryExpanded: (categoryId: string) => boolean;
  toggleCategoryExpanded: (categoryId: string) => void;
  collapseAllCategories: () => void;

  getVisibleCategories: () => Category[];
  getOrderedCategoryIds: () => string[];

  toggleInactiveVisibility: () => void;
  hasInactiveItems: () => boolean;

  toggleCategoryActive: (id: string, active: boolean) => void;
  reorderCategories: (activeId: string, overId: string) => void;

  addCategory: (input?: Partial<CreateCategoryInput>) => void;
  updateCategory: (id: string, data: UpdateCategoryInput | Category) => void;
  updateCategoryColor: (id: string, color: string[]) => void;
  replaceTemporaryCategory: (tempId: string, createdCategory: Category) => void;
  deleteCategory: (id: string) => void;

  getVisibleCourses: (categoryId: string) => Course[];
  getOrderedCourseIds: (categoryId: string) => string[];
  hasInactiveCourses: (categoryId: string) => boolean;

  toggleCourseActive: (categoryId: string, courseId: string, active: boolean) => void;
  reorderCourses: (categoryId: string, activeId: string, overId: string) => void;

  addCourse: (categoryId: string, input: CreateCourseInput) => void;
  updateCourse: (categoryId: string, courseId: string, data: UpdateCourseInput | Course) => void;
  replaceTemporaryCourse: (categoryId: string, tempId: string, createdCourse: Course) => void;
  deleteCourse: (categoryId: string, courseId: string) => void;
};

const getVisibleCoursesForCategory = (
  category: Category | undefined,
  isInactiveVisible: boolean,
): Course[] => {
  if (!category) return [];

  const notDeletedCourses = filterNotDeleted(category.courses ?? []);

  const visibleCourses = isInactiveVisible
    ? notDeletedCourses
    : notDeletedCourses.filter((course) => course.active);

  return sortEntitiesByOrderedIds(visibleCourses, category.setSeqCourse ?? []);
};

export const categoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      selectedTargetId: null,
      storedOrderedIds: [],
      expandedCategoryIds: [],
      isEditMode: false,
      isInactiveVisible: false,
      isLoading: false,
      error: null,

      setParentContext: (targetId, orderedIds = []) =>
        set({
          selectedTargetId: targetId,
          storedOrderedIds: orderedIds,
        }),

      clearParentContext: () =>
        set({
          selectedTargetId: null,
          storedOrderedIds: [],
        }),

      setCategories: (categories) =>
        set((state) => {
          const categoryMap = new Map(categories.map((category) => [category.id, category]));
          const existingIds = new Set(state.categories.map((item) => item.id));

          const updatedCategories = state.categories.map(
            (item) => categoryMap.get(item.id) ?? item,
          );

          const newCategories = categories.filter((category) => !existingIds.has(category.id));

          const mergedCategories = filterNotDeleted([...updatedCategories, ...newCategories]);

          if (!state.selectedTargetId) {
            return {
              categories: mergedCategories,
              error: null,
            };
          }

          const categoriesForTarget = getItemsForParent(
            mergedCategories,
            (item) => item.targetId === state.selectedTargetId,
          );

          const orderedIds = mergeOrderedIds(categoriesForTarget, state.storedOrderedIds);

          const sortedCategories = sortEntitiesForContext(
            mergedCategories,
            orderedIds,
            (item) => item.targetId === state.selectedTargetId,
          );

          return {
            categories: sortedCategories,
            storedOrderedIds: orderedIds,
            error: null,
          };
        }),

      replaceCategories: (categories, orderedIds) =>
        set((state) => {
          const filteredCategories = filterNotDeleted(categories);

          if (!state.selectedTargetId) {
            return {
              categories: filteredCategories,
              storedOrderedIds: orderedIds ?? [],
              error: null,
            };
          }

          const nextStoredOrderedIds = orderedIds ?? state.storedOrderedIds;

          const categoriesForTarget = getItemsForParent(
            filteredCategories,
            (item) => item.targetId === state.selectedTargetId,
          );

          const finalOrderedIds = mergeOrderedIds(categoriesForTarget, nextStoredOrderedIds);

          const sortedCategories = sortEntitiesForContext(
            filteredCategories,
            finalOrderedIds,
            (item) => item.targetId === state.selectedTargetId,
          );

          return {
            categories: sortedCategories,
            storedOrderedIds: finalOrderedIds,
            error: null,
          };
        }),

      clearCategories: () =>
        set({
          categories: [],
          selectedTargetId: null,
          storedOrderedIds: [],
          expandedCategoryIds: [],
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

      setEditMode: (value) =>
        set({
          isEditMode: value,
        }),

      isCategoryExpanded: (categoryId) => {
        return get().expandedCategoryIds.includes(categoryId);
      },

      toggleCategoryExpanded: (categoryId) =>
        set((state) => ({
          expandedCategoryIds: state.expandedCategoryIds.includes(categoryId)
            ? state.expandedCategoryIds.filter((id) => id !== categoryId)
            : [...state.expandedCategoryIds, categoryId],
        })),

      collapseAllCategories: () =>
        set({
          expandedCategoryIds: [],
        }),

      getVisibleCategories: () => {
        const { categories, selectedTargetId, isInactiveVisible, storedOrderedIds } = get();
        if (!selectedTargetId) return [];

        const categoriesForTarget = getItemsForParent(
          categories,
          (item) => item.targetId === selectedTargetId,
        );

        const visibleCategories = isInactiveVisible
          ? categoriesForTarget
          : categoriesForTarget.filter((item) => item.active);

        return sortEntitiesByOrderedIds(visibleCategories, storedOrderedIds);
      },

      getOrderedCategoryIds: () => {
        const { categories, selectedTargetId, storedOrderedIds } = get();
        if (!selectedTargetId) return [];

        const categoriesForTarget = getItemsForParent(
          categories,
          (item) => item.targetId === selectedTargetId,
        );

        return mergeOrderedIds(categoriesForTarget, storedOrderedIds);
      },

      toggleInactiveVisibility: () =>
        set((state) => ({
          isInactiveVisible: !state.isInactiveVisible,
        })),

      hasInactiveItems: () => {
        const { categories, selectedTargetId } = get();
        if (!selectedTargetId) return false;

        return getItemsForParent(categories, (item) => item.targetId === selectedTargetId).some(
          (item) => !item.active,
        );
      },

      toggleCategoryActive: (id, active) =>
        set((state) => {
          const updatedCategories = updateEntityById(state.categories, id, { active });

          if (!state.selectedTargetId) {
            return {
              categories: updatedCategories,
            };
          }

          const categoriesForTarget = getItemsForParent(
            updatedCategories,
            (item) => item.targetId === state.selectedTargetId,
          );

          const sortedCategoriesForTarget = sortByActiveStatus(
            categoriesForTarget,
            state.storedOrderedIds,
          );

          const orderedIds = sortedCategoriesForTarget.map((item) => item.id);

          const reorderedCategories = sortEntitiesForContext(
            updatedCategories,
            orderedIds,
            (item) => item.targetId === state.selectedTargetId,
          );

          return {
            categories: reorderedCategories,
            storedOrderedIds: orderedIds,
          };
        }),

      reorderCategories: (activeId, overId) =>
        set((state) => {
          if (!state.selectedTargetId) return state;

          const categoriesForTarget = getItemsForParent(
            state.categories,
            (item) => item.targetId === state.selectedTargetId,
          );

          const activeCategories = sortEntitiesByOrderedIds(
            categoriesForTarget.filter((item) => item.active),
            mergeOrderedIds(
              categoriesForTarget.filter((item) => item.active),
              state.storedOrderedIds,
            ),
          );

          const inactiveCategories = sortEntitiesByOrderedIds(
            categoriesForTarget.filter((item) => !item.active),
            state.storedOrderedIds,
          );

          const oldIndex = activeCategories.findIndex((item) => item.id === activeId);
          const newIndex = activeCategories.findIndex((item) => item.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const reorderedActiveCategories = arrayMove(activeCategories, oldIndex, newIndex);
          const orderedIds = [...reorderedActiveCategories, ...inactiveCategories].map(
            (item) => item.id,
          );

          const reorderedCategories = sortEntitiesForContext(
            state.categories,
            orderedIds,
            (item) => item.targetId === state.selectedTargetId,
          );

          return {
            categories: reorderedCategories.map((item) =>
              item.id === activeId || item.id === overId
                ? {
                    ...item,
                    updatedAt: new Date().toISOString(),
                  }
                : item,
            ),
            storedOrderedIds: orderedIds,
          };
        }),

      addCategory: (input?: Partial<CreateCategoryInput>) =>
        set((state) => {
          const targetId = state.selectedTargetId;
          if (!targetId) return state;

          const newCategory: Category = {
            id: crypto.randomUUID(),
            name: input?.name?.trim() || "Neue Kategorie",
            color: [input?.color?.[0] || "#d1d5db", input?.color?.[1] || "#000000"],
            icon: input?.icon || "",
            active: true,
            targetId,
            setSeqCourse: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
            courses: [],
            isNew: true,
          };

          const nextCategories = [newCategory, ...state.categories];

          if (state.selectedTargetId === targetId) {
            const categoriesForTarget = getItemsForParent(
              nextCategories,
              (item) => item.targetId === targetId,
            );

            const orderedIds = [
              newCategory.id,
              ...mergeOrderedIds(categoriesForTarget, state.storedOrderedIds).filter(
                (id) => id !== newCategory.id,
              ),
            ];

            const reorderedCategories = sortEntitiesForContext(
              nextCategories,
              orderedIds,
              (item) => item.targetId === targetId,
            );

            return {
              categories: reorderedCategories,
              storedOrderedIds: orderedIds,
            };
          }

          return {
            categories: nextCategories,
          };
        }),

      updateCategory: (id, data) =>
        set((state) => ({
          categories: updateEntityById(state.categories, id, data),
        })),

      updateCategoryColor: (id, color) =>
        set((state) => ({
          categories: updateEntityById(state.categories, id, { color }),
        })),

      replaceTemporaryCategory: (tempId, createdCategory) =>
        set((state) => {
          const nextCategories = state.categories.map((item) =>
            item.id === tempId
              ? {
                  ...createdCategory,
                  isNew: false,
                }
              : item,
          );

          const nextStoredOrderedIds = state.storedOrderedIds.map((id) =>
            id === tempId ? createdCategory.id : id,
          );

          const reorderedCategories = sortEntitiesForContext(
            nextCategories,
            nextStoredOrderedIds,
            (item) => item.targetId === createdCategory.targetId,
          );

          return {
            categories: reorderedCategories,
            storedOrderedIds: nextStoredOrderedIds,
          };
        }),

      deleteCategory: (id) =>
        set((state) => {
          const categoryToDelete = state.categories.find((item) => item.id === id);
          if (!categoryToDelete) return state;

          const nextCategories = state.categories.filter((item) => item.id !== id);

          if (state.selectedTargetId === categoryToDelete.targetId) {
            const remainingCategoriesForTarget = getItemsForParent(
              nextCategories,
              (item) => item.targetId === categoryToDelete.targetId,
            );

            const orderedIds = mergeOrderedIds(
              remainingCategoriesForTarget,
              state.storedOrderedIds.filter((categoryId) => categoryId !== id),
            );

            const reorderedCategories = sortEntitiesForContext(
              nextCategories,
              orderedIds,
              (item) => item.targetId === categoryToDelete.targetId,
            );

            return {
              categories: reorderedCategories,
              storedOrderedIds: orderedIds,
              expandedCategoryIds: state.expandedCategoryIds.filter(
                (categoryId) => categoryId !== id,
              ),
            };
          }

          return {
            categories: nextCategories,
            expandedCategoryIds: state.expandedCategoryIds.filter(
              (categoryId) => categoryId !== id,
            ),
          };
        }),

      getVisibleCourses: (categoryId) => {
        const { categories, isInactiveVisible } = get();
        const category = categories.find((item) => item.id === categoryId);

        return getVisibleCoursesForCategory(category, isInactiveVisible);
      },

      getOrderedCourseIds: (categoryId) => {
        const { categories } = get();
        const category = categories.find((item) => item.id === categoryId);
        if (!category) return [];

        const courses = filterNotDeleted(category.courses ?? []);
        return mergeOrderedIds(courses, category.setSeqCourse ?? []);
      },

      hasInactiveCourses: (categoryId) => {
        const { categories } = get();
        const category = categories.find((item) => item.id === categoryId);
        if (!category) return false;

        return filterNotDeleted(category.courses ?? []).some((course) => !course.active);
      },

      toggleCourseActive: (categoryId, courseId, active) =>
        set((state) => {
          const nextCategories = state.categories.map((category) => {
            if (category.id !== categoryId) return category;

            const updatedCourses = updateEntityById(category.courses ?? [], courseId, { active });
            const visibleCourses = filterNotDeleted(updatedCourses);

            const sortedCourses = sortByActiveStatus(visibleCourses, category.setSeqCourse ?? []);
            const orderedIds = sortedCourses.map((course) => course.id);

            return {
              ...category,
              courses: sortEntitiesByOrderedIds(visibleCourses, orderedIds),
              setSeqCourse: orderedIds,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            categories: nextCategories,
          };
        }),

      reorderCourses: (categoryId, activeId, overId) =>
        set((state) => {
          const nextCategories = state.categories.map((category) => {
            if (category.id !== categoryId) return category;

            const courses = filterNotDeleted(category.courses ?? []);

            const activeCourses = sortEntitiesByOrderedIds(
              courses.filter((course) => course.active),
              mergeOrderedIds(
                courses.filter((course) => course.active),
                category.setSeqCourse ?? [],
              ),
            );

            const inactiveCourses = sortEntitiesByOrderedIds(
              courses.filter((course) => !course.active),
              category.setSeqCourse ?? [],
            );

            const oldIndex = activeCourses.findIndex((course) => course.id === activeId);
            const newIndex = activeCourses.findIndex((course) => course.id === overId);

            if (oldIndex === -1 || newIndex === -1) return category;

            const reorderedActiveCourses = arrayMove(activeCourses, oldIndex, newIndex);
            const orderedIds = [...reorderedActiveCourses, ...inactiveCourses].map(
              (course) => course.id,
            );

            const updatedCourses = courses.map((course) =>
              course.id === activeId || course.id === overId
                ? {
                    ...course,
                    updatedAt: new Date().toISOString(),
                  }
                : course,
            );

            return {
              ...category,
              courses: sortEntitiesByOrderedIds(updatedCourses, orderedIds),
              setSeqCourse: orderedIds,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            categories: nextCategories,
          };
        }),

      addCourse: (categoryId, input) =>
        set((state) => {
          const nextCategories = state.categories.map((category) => {
            if (category.id !== categoryId) return category;

            const newCourse: Course = {
              id: crypto.randomUUID(),
              name: input.name?.trim() || "Neuer Kurs",
              active: true,
              categoryId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isDeleted: false,
              isNew: true,
            } as Course;

            const nextCourses = [newCourse, ...(category.courses ?? [])];

            const filteredCourses = filterNotDeleted(nextCourses);
            const orderedIds = [
              newCourse.id,
              ...mergeOrderedIds(filteredCourses, category.setSeqCourse ?? []).filter(
                (id) => id !== newCourse.id,
              ),
            ];

            return {
              ...category,
              courses: sortEntitiesByOrderedIds(filteredCourses, orderedIds),
              setSeqCourse: orderedIds,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            categories: nextCategories,
          };
        }),

      updateCourse: (categoryId, courseId, data) =>
        set((state) => {
          const nextCategories = state.categories.map((category) => {
            if (category.id !== categoryId) return category;

            return {
              ...category,
              courses: updateEntityById(category.courses ?? [], courseId, data),
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            categories: nextCategories,
          };
        }),

      replaceTemporaryCourse: (categoryId, tempId, createdCourse) =>
        set((state) => {
          const nextCategories = state.categories.map((category) => {
            if (category.id !== categoryId) return category;

            const nextCourses = (category.courses ?? []).map((course) =>
              course.id === tempId
                ? {
                    ...createdCourse,
                    isNew: false,
                  }
                : course,
            );

            const nextOrderedIds = (category.setSeqCourse ?? []).map((id) =>
              id === tempId ? createdCourse.id : id,
            );

            return {
              ...category,
              courses: sortEntitiesByOrderedIds(filterNotDeleted(nextCourses), nextOrderedIds),
              setSeqCourse: nextOrderedIds,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            categories: nextCategories,
          };
        }),

      deleteCourse: (categoryId, courseId) =>
        set((state) => {
          const nextCategories = state.categories.map((category) => {
            if (category.id !== categoryId) return category;

            const nextCourses = (category.courses ?? []).filter((course) => course.id !== courseId);

            const filteredCourses = filterNotDeleted(nextCourses);
            const orderedIds = mergeOrderedIds(
              filteredCourses,
              (category.setSeqCourse ?? []).filter((id) => id !== courseId),
            );

            return {
              ...category,
              courses: sortEntitiesByOrderedIds(filteredCourses, orderedIds),
              setSeqCourse: orderedIds,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            categories: nextCategories,
          };
        }),
    }),
    {
      name: "categories-ui-storage",
      partialize: (state) => ({
        expandedCategoryIds: state.expandedCategoryIds,
        isEditMode: state.isEditMode,
        isInactiveVisible: state.isInactiveVisible,
      }),
    },
  ),
);
