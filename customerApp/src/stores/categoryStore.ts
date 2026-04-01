import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types/course-types";
import {
  sortEntitiesByOrderedIds,
  mergeOrderedIds,
  filterNotDeleted,
  sortByActiveStatus,
} from "../lib/courses/sorting-utils";

type CategoryStore = {
  courseCategories: Category[];
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

  addCategory: (input: CreateCategoryInput) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, data: UpdateCategoryInput | Category) => void;
  updateCategoryColor: (id: string, color: string[]) => void;
  replaceTemporaryCategory: (tempId: string, createdCategory: Category) => void;
};

const getCategoriesForTarget = (categories: Category[], targetId: string) => {
  return filterNotDeleted(categories.filter((item) => item.targetId === targetId));
};

export const categoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      courseCategories: [],
      selectedTargetId: null,
      storedOrderedIds: [],
      expandedCategoryIds: [],
      isEditMode: false,
      isLoading: false,
      error: null,
      isInactiveVisible: false,

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

          const updatedCategories = state.courseCategories.map(
            (item) => categoryMap.get(item.id) ?? item,
          );

          const newCategories = categories.filter(
            (category) => !state.courseCategories.some((item) => item.id === category.id),
          );

          const mergedCategories = filterNotDeleted([...updatedCategories, ...newCategories]);

          if (!state.selectedTargetId) {
            return {
              courseCategories: mergedCategories,
              error: null,
            };
          }

          const targetCategories = getCategoriesForTarget(mergedCategories, state.selectedTargetId);
          const orderedIds = mergeOrderedIds(targetCategories, state.storedOrderedIds);
          const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

          const sortedCategories = [...mergedCategories].sort((a, b) => {
            const aIsCurrentTarget = a.targetId === state.selectedTargetId;
            const bIsCurrentTarget = b.targetId === state.selectedTargetId;

            if (aIsCurrentTarget && bIsCurrentTarget) {
              if (a.active !== b.active) return a.active ? -1 : 1;

              const aIndex = orderMap.get(a.id);
              const bIndex = orderMap.get(b.id);

              const aHasOrder = aIndex !== undefined;
              const bHasOrder = bIndex !== undefined;

              if (aHasOrder && bHasOrder) return aIndex - bIndex;
              if (aHasOrder) return -1;
              if (bHasOrder) return 1;

              return a.createdAt.localeCompare(b.createdAt);
            }

            return 0;
          });

          return {
            courseCategories: sortedCategories,
            storedOrderedIds: orderedIds,
            error: null,
          };
        }),

      replaceCategories: (categories, orderedIds) =>
        set((state) => {
          const filteredCategories = filterNotDeleted(categories);

          if (!state.selectedTargetId) {
            return {
              courseCategories: filteredCategories,
              storedOrderedIds: orderedIds ?? state.storedOrderedIds,
              error: null,
            };
          }

          const nextStoredOrderedIds = orderedIds ?? state.storedOrderedIds;
          const targetCategories = getCategoriesForTarget(
            filteredCategories,
            state.selectedTargetId,
          );
          const finalOrderedIds = mergeOrderedIds(targetCategories, nextStoredOrderedIds);
          const orderMap = new Map(finalOrderedIds.map((id, index) => [id, index]));

          const sortedCategories = [...filteredCategories].sort((a, b) => {
            const aIsCurrentTarget = a.targetId === state.selectedTargetId;
            const bIsCurrentTarget = b.targetId === state.selectedTargetId;

            if (aIsCurrentTarget && bIsCurrentTarget) {
              if (a.active !== b.active) return a.active ? -1 : 1;

              const aIndex = orderMap.get(a.id);
              const bIndex = orderMap.get(b.id);

              const aHasOrder = aIndex !== undefined;
              const bHasOrder = bIndex !== undefined;

              if (aHasOrder && bHasOrder) return aIndex - bIndex;
              if (aHasOrder) return -1;
              if (bHasOrder) return 1;

              return a.createdAt.localeCompare(b.createdAt);
            }

            return 0;
          });

          return {
            courseCategories: sortedCategories,
            storedOrderedIds: finalOrderedIds,
            error: null,
          };
        }),

      clearCategories: () =>
        set({
          courseCategories: [],
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
        const { courseCategories, selectedTargetId, isInactiveVisible } = get();
        if (!selectedTargetId) return [];

        return courseCategories.filter((item) => {
          const isMatchingTarget = item.targetId === selectedTargetId;
          const isVisibleByDelete = !item.isDeleted;
          const isVisibleByActive = isInactiveVisible ? true : item.active;

          return isMatchingTarget && isVisibleByDelete && isVisibleByActive;
        });
      },

      toggleInactiveVisibility: () =>
        set((state) => ({
          isInactiveVisible: !state.isInactiveVisible,
        })),

      hasInactiveItems: () => {
        const { courseCategories, selectedTargetId } = get();
        if (!selectedTargetId) return false;

        return courseCategories.some(
          (item) => item.targetId === selectedTargetId && !item.isDeleted && !item.active,
        );
      },

      getOrderedCategoryIds: () => {
        const { courseCategories, selectedTargetId } = get();
        if (!selectedTargetId) return [];

        return courseCategories
          .filter((item) => item.targetId === selectedTargetId && !item.isDeleted)
          .map((item) => item.id);
      },

      toggleCategoryActive: (id, active) =>
        set((state) => {
          const updatedCategories = state.courseCategories.map((item) =>
            item.id === id
              ? {
                  ...item,
                  active,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          );

          if (!state.selectedTargetId) {
            return { courseCategories: updatedCategories };
          }

          const targetCategories = getCategoriesForTarget(
            updatedCategories,
            state.selectedTargetId,
          );

          const sorted = sortByActiveStatus(targetCategories, state.storedOrderedIds);
          const orderedIds = sorted.map((item) => item.id);

          const orderMap = new Map(orderedIds.map((categoryId, index) => [categoryId, index]));

          const reorderedCategories = [...updatedCategories].sort((a, b) => {
            const aIsCurrentTarget = a.targetId === state.selectedTargetId;
            const bIsCurrentTarget = b.targetId === state.selectedTargetId;

            if (aIsCurrentTarget && bIsCurrentTarget) {
              if (a.active !== b.active) return a.active ? -1 : 1;

              const aIndex = orderMap.get(a.id);
              const bIndex = orderMap.get(b.id);

              const aHasOrder = aIndex !== undefined;
              const bHasOrder = bIndex !== undefined;

              if (aHasOrder && bHasOrder) return aIndex - bIndex;
              if (aHasOrder) return -1;
              if (bHasOrder) return 1;

              return a.createdAt.localeCompare(b.createdAt);
            }

            return 0;
          });

          return {
            courseCategories: reorderedCategories,
            storedOrderedIds: orderedIds,
          };
        }),

      reorderCategories: (activeId, overId) =>
        set((state) => {
          if (!state.selectedTargetId) return state;

          const targetCategories = getCategoriesForTarget(
            state.courseCategories,
            state.selectedTargetId,
          );

          const activeCategories = targetCategories.filter((item) => item.active);
          const inactiveCategories = targetCategories.filter((item) => !item.active);

          const mergedOrderedIds = mergeOrderedIds(activeCategories, state.storedOrderedIds);

          const sortedActiveCategories = sortEntitiesByOrderedIds(
            activeCategories,
            mergedOrderedIds,
          );

          const sortedInactiveCategories = sortEntitiesByOrderedIds(
            inactiveCategories,
            state.storedOrderedIds,
          );

          const oldIndex = sortedActiveCategories.findIndex((item) => item.id === activeId);
          const newIndex = sortedActiveCategories.findIndex((item) => item.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const reorderedActiveCategories = arrayMove(sortedActiveCategories, oldIndex, newIndex);

          const orderedIds = [...reorderedActiveCategories, ...sortedInactiveCategories].map(
            (item) => item.id,
          );

          const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

          const reorderedCategories = [...state.courseCategories].sort((a, b) => {
            const aIsCurrentTarget = a.targetId === state.selectedTargetId;
            const bIsCurrentTarget = b.targetId === state.selectedTargetId;

            if (aIsCurrentTarget && bIsCurrentTarget) {
              if (a.active !== b.active) return a.active ? -1 : 1;

              const aIndex = orderMap.get(a.id);
              const bIndex = orderMap.get(b.id);

              const aHasOrder = aIndex !== undefined;
              const bHasOrder = bIndex !== undefined;

              if (aHasOrder && bHasOrder) return aIndex - bIndex;
              if (aHasOrder) return -1;
              if (bHasOrder) return 1;

              return a.createdAt.localeCompare(b.createdAt);
            }

            return 0;
          });

          return {
            courseCategories: reorderedCategories.map((item) =>
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

      addCategory: (input) =>
        set((state) => {
          const targetId = input.targetId || state.selectedTargetId;
          if (!targetId) return state;

          const newCategory: Category = {
            id: crypto.randomUUID(),
            name: input.name?.trim() || "Neue Kategorie",
            color: [input.color?.[0] || "#d1d5db", input.color?.[1] || "#000000"],
            active: true,
            targetId,
            setSeqCourse: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
            courses: [],
            isNew: true,
          };

          const nextCategories = [newCategory, ...state.courseCategories];

          if (state.selectedTargetId === targetId) {
            const targetCategories = getCategoriesForTarget(nextCategories, targetId);

            const orderedIds = [
              newCategory.id,
              ...mergeOrderedIds(targetCategories, state.storedOrderedIds).filter(
                (id) => id !== newCategory.id,
              ),
            ];

            const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

            nextCategories.sort((a, b) => {
              const aIsCurrentTarget = a.targetId === targetId;
              const bIsCurrentTarget = b.targetId === targetId;

              if (aIsCurrentTarget && bIsCurrentTarget) {
                if (a.active !== b.active) return a.active ? -1 : 1;

                const aIndex = orderMap.get(a.id);
                const bIndex = orderMap.get(b.id);

                const aHasOrder = aIndex !== undefined;
                const bHasOrder = bIndex !== undefined;

                if (aHasOrder && bHasOrder) return aIndex - bIndex;
                if (aHasOrder) return -1;
                if (bHasOrder) return 1;

                return a.createdAt.localeCompare(b.createdAt);
              }

              return 0;
            });

            return {
              courseCategories: nextCategories,
              storedOrderedIds: orderedIds,
            };
          }

          return {
            courseCategories: nextCategories,
          };
        }),

      updateCategory: (id, data) =>
        set((state) => ({
          courseCategories: state.courseCategories.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),

      updateCategoryColor: (id, color) =>
        set((state) => ({
          courseCategories: state.courseCategories.map((item) =>
            item.id === id
              ? {
                  ...item,
                  color,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),

      replaceTemporaryCategory: (tempId, createdCategory) =>
        set((state) => ({
          courseCategories: state.courseCategories.map((item) =>
            item.id === tempId
              ? {
                  ...createdCategory,
                  isNew: false,
                }
              : item,
          ),
        })),

      deleteCategory: (id) =>
        set((state) => {
          const categoryToDelete = state.courseCategories.find((item) => item.id === id);
          if (!categoryToDelete) return state;

          const nextCategories = state.courseCategories.filter((item) => item.id !== id);

          if (state.selectedTargetId === categoryToDelete.targetId) {
            const remainingCategoriesForTarget = getCategoriesForTarget(
              nextCategories,
              categoryToDelete.targetId,
            );

            const orderedIds = mergeOrderedIds(
              remainingCategoriesForTarget,
              state.storedOrderedIds.filter((categoryId) => categoryId !== id),
            );

            const orderMap = new Map(orderedIds.map((categoryId, index) => [categoryId, index]));

            nextCategories.sort((a, b) => {
              const aIsCurrentTarget = a.targetId === categoryToDelete.targetId;
              const bIsCurrentTarget = b.targetId === categoryToDelete.targetId;

              if (aIsCurrentTarget && bIsCurrentTarget) {
                if (a.active !== b.active) return a.active ? -1 : 1;

                const aIndex = orderMap.get(a.id);
                const bIndex = orderMap.get(b.id);

                const aHasOrder = aIndex !== undefined;
                const bHasOrder = bIndex !== undefined;

                if (aHasOrder && bHasOrder) return aIndex - bIndex;
                if (aHasOrder) return -1;
                if (bHasOrder) return 1;

                return a.createdAt.localeCompare(b.createdAt);
              }

              return 0;
            });

            return {
              courseCategories: nextCategories,
              storedOrderedIds: orderedIds,
              expandedCategoryIds: state.expandedCategoryIds.filter(
                (categoryId) => categoryId !== id,
              ),
            };
          }

          return {
            courseCategories: nextCategories,
            expandedCategoryIds: state.expandedCategoryIds.filter(
              (categoryId) => categoryId !== id,
            ),
          };
        }),
    }),
    {
      name: "courseCategories-ui-storage",
      partialize: (state) => ({
        expandedCategoryIds: state.expandedCategoryIds,
        isEditMode: state.isEditMode,
        isInactiveVisible: state.isInactiveVisible,
      }),
    },
  ),
);
