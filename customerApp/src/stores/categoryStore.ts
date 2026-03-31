import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import type { Course, Category, TargetDetail } from "../types/course-types.ts";

type CreateCategoryInput = {
  name?: string;
};

type UpdateCategoryInput = {
  name?: string;
};

type CreateCourseInput = Partial<Omit<Course, "id" | "seq">> & {
  name?: string;
};

type UpdateCourseInput = Partial<Omit<Course, "id" | "seq">>;

type CategoryStore = {
  selectedCourseTargetId: string | null;
  selectedCategoryId: string | null;
  courseTargetDetail: TargetDetail | null;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;

  expandedCategoryIds: string[];

  setSelectedTargetId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;

  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;

  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;

  isCategoryExpanded: (categoryId: string) => boolean;
  toggleCategoryExpanded: (categoryId: string) => void;
  expandCategory: (categoryId: string) => void;
  updateCategoryColor: (id: string, color: string[]) => void;
  collapseCategory: (categoryId: string) => void;
  collapseAllCategories: () => void;
  expandAllCategories: () => void;

  loadCourseTargetDetail: (data: TargetDetail) => void;
  resetCourseTargetDetail: () => void;

  setCategories: (categories: Category[]) => void;

  addCategory: (input?: CreateCategoryInput) => void;
  updateCategory: (categoryId: string, data: UpdateCategoryInput) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (activeId: string, overId: string) => void;

  addCourse: (categoryId: string, input?: CreateCourseInput) => void;
  updateCourse: (categoryId: string, courseId: string, data: UpdateCourseInput) => void;
  deleteCourse: (categoryId: string, courseId: string) => void;
  reorderCourses: (categoryId: string, activeId: string, overId: string) => void;
};

const sortBySeq = <T extends { seq: number }>(items: T[] = []): T[] => {
  return [...items].sort((a, b) => a.seq - b.seq);
};

const withUpdatedCourseSeq = (courses: Course[]): Course[] => {
  return courses.map((course, index) => ({
    ...course,
    seq: index + 1,
  }));
};

const withUpdatedCategorySeq = (categories: Category[]): Category[] => {
  return categories.map((category, index) => ({
    ...category,
    seq: index + 1,
  }));
};

const normalizeCategories = (categories: Category[]): Category[] => {
  const sortedCategories = sortBySeq(categories ?? []).map((category) => ({
    ...category,
    courses: withUpdatedCourseSeq(sortBySeq(category.courses ?? [])),
  }));

  return withUpdatedCategorySeq(sortedCategories);
};

const defaultCourseValues = (): Omit<Course, "id" | "seq"> => ({
  name: "Neuer Kurs",
  description: "",
  startsAt: new Date().toISOString(),
  repeat: 1,
  frequency: "weekly",
  seatsCurrent: 0,
  seatsMax: 10,
  paymentTypes: ["cash"],
  contractTypes: ["one-time"],
  price: 0,
  duration: 60,
});

export const categoryStore = create<CategoryStore>((set, get) => ({
  selectedCourseTargetId: null,
  selectedCategoryId: null,
  courseTargetDetail: null,
  isLoading: false,
  error: null,
  isEditMode: false,
  expandedCategoryIds: [],

  setSelectedTargetId: (id) =>
    set({
      selectedCourseTargetId: id,
    }),

  setSelectedCategoryId: (id) =>
    set({
      selectedCategoryId: id,
    }),

  setLoading: (value) =>
    set({
      isLoading: value,
    }),

  setError: (message) =>
    set({
      error: message,
    }),

  toggleEditMode: () =>
    set((state) => ({
      isEditMode: !state.isEditMode,
    })),

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

  expandCategory: (categoryId) =>
    set((state) => ({
      expandedCategoryIds: state.expandedCategoryIds.includes(categoryId)
        ? state.expandedCategoryIds
        : [...state.expandedCategoryIds, categoryId],
    })),

  updateCategoryColor: (id, color) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      const updatedCategories = state.courseTargetDetail.categories.map((category) =>
        category.id === id
          ? {
              ...category,
              color: color[0],
              fontColor: color[1],
            }
          : category,
      );

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
      };
    }),

  collapseCategory: (categoryId) =>
    set((state) => ({
      expandedCategoryIds: state.expandedCategoryIds.filter((id) => id !== categoryId),
    })),

  collapseAllCategories: () =>
    set({
      expandedCategoryIds: [],
    }),

  expandAllCategories: () =>
    set((state) => ({
      expandedCategoryIds:
        state.courseTargetDetail?.categories.map((category) => category.id) ?? [],
    })),

  loadCourseTargetDetail: (data) =>
    set({
      selectedCourseTargetId: data.id,
      selectedCategoryId: data.categories?.[0]?.id ?? null,
      courseTargetDetail: {
        ...data,
        categories: normalizeCategories(data.categories ?? []),
      },
      expandedCategoryIds: [],
      isLoading: false,
      error: null,
    }),

  resetCourseTargetDetail: () =>
    set({
      selectedCourseTargetId: null,
      selectedCategoryId: null,
      courseTargetDetail: null,
      isLoading: false,
      error: null,
      isEditMode: false,
      expandedCategoryIds: [],
    }),

  setCategories: (categories) =>
    set((state) => {
      const normalizedCategories = normalizeCategories(categories);
      const validCategoryIds = new Set(normalizedCategories.map((category) => category.id));

      return {
        courseTargetDetail: {
          id: state.courseTargetDetail?.id ?? state.selectedCourseTargetId ?? "",
          name: state.courseTargetDetail?.name ?? "Kategorien",
          color: state.courseTargetDetail?.color ?? "#000000",
          categories: normalizedCategories,
        },
        selectedCategoryId:
          normalizedCategories.find((category) => category.id === state.selectedCategoryId)?.id ??
          normalizedCategories[0]?.id ??
          null,
        expandedCategoryIds: state.expandedCategoryIds.filter((id) => validCategoryIds.has(id)),
      };
    }),

  addCategory: (input) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      const newCategory: Category = {
        id: crypto.randomUUID(),
        seq: state.courseTargetDetail.categories.length + 1,
        name: input?.name?.trim() || "Neue Kategorie",
        color: "#000000",
        courses: [],
      };

      const updatedCategories = withUpdatedCategorySeq([
        ...state.courseTargetDetail.categories,
        newCategory,
      ]);

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
        selectedCategoryId: newCategory.id,
        expandedCategoryIds: [...state.expandedCategoryIds, newCategory.id],
      };
    }),

  updateCategory: (categoryId, data) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: state.courseTargetDetail.categories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  ...data,
                }
              : category,
          ),
        },
      };
    }),

  deleteCategory: (categoryId) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      const updatedCategories = withUpdatedCategorySeq(
        state.courseTargetDetail.categories.filter((category) => category.id !== categoryId),
      );

      const nextSelectedCategoryId =
        state.selectedCategoryId === categoryId
          ? (updatedCategories[0]?.id ?? null)
          : state.selectedCategoryId;

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
        selectedCategoryId: nextSelectedCategoryId,
        expandedCategoryIds: state.expandedCategoryIds.filter((id) => id !== categoryId),
      };
    }),

  reorderCategories: (activeId, overId) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;
      if (activeId === overId) return state;

      const categories = state.courseTargetDetail.categories;
      const oldIndex = categories.findIndex((category) => category.id === activeId);
      const newIndex = categories.findIndex((category) => category.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const reorderedCategories = arrayMove(categories, oldIndex, newIndex);

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: withUpdatedCategorySeq(reorderedCategories),
        },
      };
    }),

  addCourse: (categoryId, input) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      const updatedCategories = state.courseTargetDetail.categories.map((category) => {
        if (category.id !== categoryId) return category;

        const newCourse: Course = {
          id: crypto.randomUUID(),
          seq: category.courses.length + 1,
          ...defaultCourseValues(),
          ...input,
          name: input?.name?.trim() || "Neuer Kurs",
        };

        return {
          ...category,
          courses: withUpdatedCourseSeq([...category.courses, newCourse]),
        };
      });

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
      };
    }),

  updateCourse: (categoryId, courseId, data) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      const updatedCategories = state.courseTargetDetail.categories.map((category) => {
        if (category.id !== categoryId) return category;

        return {
          ...category,
          courses: category.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  ...data,
                }
              : course,
          ),
        };
      });

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
      };
    }),

  deleteCourse: (categoryId, courseId) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;

      const updatedCategories = state.courseTargetDetail.categories.map((category) => {
        if (category.id !== categoryId) return category;

        return {
          ...category,
          courses: withUpdatedCourseSeq(
            category.courses.filter((course) => course.id !== courseId),
          ),
        };
      });

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
      };
    }),

  reorderCourses: (categoryId, activeId, overId) =>
    set((state) => {
      if (!state.courseTargetDetail) return state;
      if (activeId === overId) return state;

      const updatedCategories = state.courseTargetDetail.categories.map((category) => {
        if (category.id !== categoryId) return category;

        const oldIndex = category.courses.findIndex((course) => course.id === activeId);
        const newIndex = category.courses.findIndex((course) => course.id === overId);

        if (oldIndex === -1 || newIndex === -1) return category;

        return {
          ...category,
          courses: withUpdatedCourseSeq(arrayMove(category.courses, oldIndex, newIndex)),
        };
      });

      return {
        courseTargetDetail: {
          ...state.courseTargetDetail,
          categories: updatedCategories,
        },
      };
    }),
}));
