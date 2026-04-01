import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { Target } from "../types/course-types";
import { userStore } from "./userStore";
import type { UpdateTargetInput, CreateTargetInput } from "../types/course-types";

type TargetStore = {
  courseTargets: Target[];
  isInactiveVisible: boolean;
  isLoading: boolean;
  error: string | null;

  toggleInactiveVisibility: () => void;

  setTargets: (targets: Target[]) => void;
  replaceTargets: (targets: Target[]) => void;
  clearTargets: () => void;

  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;

  getVisibleTargets: () => Target[];
  getOrderedTargetIds: () => string[];

  toggleTargetActive: (id: string, active: boolean) => void;
  reorderTargets: (activeId: string, overId: string) => void;
  addTarget: (input: CreateTargetInput) => void;
  deleteTarget: (id: string) => void;
  updateTarget: (id: string, data: UpdateTargetInput) => void;
  updateColor: (id: string, color: string[]) => void;
  updateIcon: (id: string, icon: string) => void;
  replaceTemporaryTarget: (tempId: string, createdTarget: Target) => void;
};

const filterNotDeleted = <T extends { isDeleted: boolean }>(items: T[]) => {
  return items.filter((item) => !item.isDeleted);
};

const sortTargetsByOrderedIds = <T extends { id: string; createdAt: string; active: boolean }>(
  items: T[],
  orderedIds: string[] = [],
) => {
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

  return [...items].sort((a, b) => {
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }

    const aIndex = orderMap.get(a.id);
    const bIndex = orderMap.get(b.id);

    const aHasOrder = aIndex !== undefined;
    const bHasOrder = bIndex !== undefined;

    if (aHasOrder && bHasOrder) return aIndex - bIndex;
    if (aHasOrder) return -1;
    if (bHasOrder) return 1;

    return a.createdAt.localeCompare(b.createdAt);
  });
};

const mergeOrderedIds = <T extends { id: string }>(items: T[], orderedIds: string[] = []) => {
  const validIds = new Set(items.map((item) => item.id));

  const existingOrderedIds = orderedIds.filter((id) => validIds.has(id));
  const missingIds = items
    .filter((item) => !existingOrderedIds.includes(item.id))
    .map((item) => item.id);

  return [...existingOrderedIds, ...missingIds];
};

const getSelectedLocation = () => userStore.getState().getActiveLocation();

const getTargetsForLocation = (targets: Target[], locationId: string) => {
  return filterNotDeleted(targets.filter((item) => item.locationId === locationId));
};

export const targetStore = create<TargetStore>()(
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

      setTargets: (targets) =>
        set((state) => {
          const targetMap = new Map(targets.map((t) => [t.id, t]));

          const updatedCourseTargets = state.courseTargets.map(
            (item) => targetMap.get(item.id) ?? item,
          );

          const newTargets = targets.filter((t) => !targetMap.has(t.id));

          return {
            courseTargets: filterNotDeleted([...updatedCourseTargets, ...newTargets]),
            error: null,
          };
        }),

      replaceTargets: (targets) =>
        set(() => {
          const selectedLocation = userStore.getState().getActiveLocation();
          const filteredTargets = filterNotDeleted(targets);

          if (!selectedLocation) {
            return {
              courseTargets: filteredTargets,
              error: null,
            };
          }

          const storedOrderedIds = selectedLocation.setSeqTarget ?? [];
          const mergedOrderedIds = mergeOrderedIds(
            filteredTargets.filter((item) => item.locationId === selectedLocation.id),
            storedOrderedIds,
          );

          const orderMap = new Map(mergedOrderedIds.map((id, index) => [id, index]));

          const sortedTargets = [...filteredTargets].sort((a, b) => {
            const aIsCurrentLocation = a.locationId === selectedLocation.id;
            const bIsCurrentLocation = b.locationId === selectedLocation.id;

            if (aIsCurrentLocation && bIsCurrentLocation) {
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
            courseTargets: sortedTargets,
            error: null,
          };
        }),

      clearTargets: () =>
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

      getVisibleTargets: () => {
        const { courseTargets, isInactiveVisible } = get();
        const selectedLocation = getSelectedLocation();

        if (!selectedLocation) return [];

        const targetsForLocation = getTargetsForLocation(courseTargets, selectedLocation.id);
        const storedOrderedIds = selectedLocation.setSeqTarget ?? [];

        const targets = isInactiveVisible
          ? targetsForLocation
          : targetsForLocation.filter((item) => item.active);

        return sortTargetsByOrderedIds(targets, storedOrderedIds);
      },

      getOrderedTargetIds: () => {
        const { courseTargets } = get();
        const selectedLocation = getSelectedLocation();

        if (!selectedLocation) return [];

        return courseTargets
          .filter((item) => item.locationId === selectedLocation.id && !item.isDeleted)
          .map((item) => item.id);
      },

      toggleTargetActive: (id, active) =>
        set((state) => {
          const updatedTargets = state.courseTargets.map((item) =>
            item.id === id
              ? {
                  ...item,
                  active,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          );

          const selectedLocation = getSelectedLocation();
          if (!selectedLocation) {
            return { courseTargets: updatedTargets };
          }

          const locationTargets = getTargetsForLocation(updatedTargets, selectedLocation.id);
          const activeTargets = locationTargets.filter((item) => item.active);
          const inactiveTargets = locationTargets.filter((item) => !item.active);

          const storedOrderedIds = selectedLocation.setSeqTarget ?? [];
          const orderedIds = [
            ...sortTargetsByOrderedIds(activeTargets, storedOrderedIds),
            ...sortTargetsByOrderedIds(inactiveTargets, storedOrderedIds),
          ].map((item) => item.id);

          userStore.getState().updateLocationTargetOrder(selectedLocation.id, orderedIds);

          const orderMap = new Map(orderedIds.map((targetId, index) => [targetId, index]));

          const reorderedCourseTargets = [...updatedTargets].sort((a, b) => {
            const aIsCurrentLocation = a.locationId === selectedLocation.id;
            const bIsCurrentLocation = b.locationId === selectedLocation.id;

            if (aIsCurrentLocation && bIsCurrentLocation) {
              if (a.active !== b.active) {
                return a.active ? -1 : 1;
              }

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
            courseTargets: reorderedCourseTargets,
          };
        }),

      reorderTargets: (activeId, overId) =>
        set((state) => {
          const selectedLocation = getSelectedLocation();
          if (!selectedLocation) return state;

          const locationTargets = getTargetsForLocation(state.courseTargets, selectedLocation.id);
          const storedOrderedIds = selectedLocation.setSeqTarget ?? [];

          const activeTargets = sortTargetsByOrderedIds(
            locationTargets.filter((item) => item.active),
            storedOrderedIds,
          );

          const inactiveTargets = sortTargetsByOrderedIds(
            locationTargets.filter((item) => !item.active),
            storedOrderedIds,
          );

          const oldIndex = activeTargets.findIndex((item) => item.id === activeId);
          const newIndex = activeTargets.findIndex((item) => item.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const reorderedActiveTargets = arrayMove(activeTargets, oldIndex, newIndex);
          const orderedIds = [...reorderedActiveTargets, ...inactiveTargets].map((item) => item.id);

          userStore.getState().updateLocationTargetOrder(selectedLocation.id, orderedIds);

          const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

          const reorderedCourseTargets = [...state.courseTargets].sort((a, b) => {
            const aIsCurrentLocation = a.locationId === selectedLocation.id;
            const bIsCurrentLocation = b.locationId === selectedLocation.id;

            if (aIsCurrentLocation && bIsCurrentLocation) {
              if (a.active !== b.active) {
                return a.active ? -1 : 1;
              }

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
            courseTargets: reorderedCourseTargets.map((item) =>
              item.id === activeId || item.id === overId
                ? { ...item, updatedAt: new Date().toISOString() }
                : item,
            ),
          };
        }),

      addTarget: (input) =>
        set((state) => {
          const selectedLocationId = userStore.getState().selectedLocationId;
          if (!selectedLocationId) return state;

          const locationId = input.locationId || selectedLocationId;

          const newTarget: Target = {
            id: crypto.randomUUID(),
            name: input.name?.trim() || "Neue Zielgruppe",
            color: input.color || ["#ff0000", "#ffffff"],
            icon: input.icon || "",
            active: true,
            setSeqCategory: [],
            locationId,
            tenantId: input.tenantId || "seed",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false,
            isNew: true,
          };

          const nextCourseTargets = [newTarget, ...state.courseTargets];
          const selectedLocation = userStore
            .getState()
            .user?.locations.find((loc) => loc.id === locationId);

          if (selectedLocation) {
            const locationTargets = getTargetsForLocation(nextCourseTargets, locationId);
            const storedOrderedIds = selectedLocation.setSeqTarget ?? [];

            const orderedIds = [
              newTarget.id,
              ...mergeOrderedIds(locationTargets, storedOrderedIds).filter(
                (id) => id !== newTarget.id,
              ),
            ];

            userStore.getState().updateLocationTargetOrder(locationId, orderedIds);

            const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

            nextCourseTargets.sort((a, b) => {
              const aIsCurrentLocation = a.locationId === locationId;
              const bIsCurrentLocation = b.locationId === locationId;

              if (aIsCurrentLocation && bIsCurrentLocation) {
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
          }

          return {
            courseTargets: nextCourseTargets,
          };
        }),

      updateTarget: (id, data) =>
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

      updateIcon: (id, icon) =>
        set((state) => ({
          courseTargets: state.courseTargets.map((item) =>
            item.id === id
              ? {
                  ...item,
                  icon,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),

      replaceTemporaryTarget: (tempId, createdTarget) =>
        set((state) => ({
          courseTargets: state.courseTargets.map((item) =>
            item.id === tempId
              ? {
                  ...createdTarget,
                  isNew: false,
                }
              : item,
          ),
        })),

      deleteTarget: (id) =>
        set((state) => {
          const targetToDelete = state.courseTargets.find((item) => item.id === id);
          if (!targetToDelete) return state;

          const nextCourseTargets = state.courseTargets.filter((item) => item.id !== id);
          const selectedLocation = userStore
            .getState()
            .user?.locations.find((loc) => loc.id === targetToDelete.locationId);

          if (selectedLocation) {
            const remainingTargetsForLocation = getTargetsForLocation(
              nextCourseTargets,
              targetToDelete.locationId,
            );

            const storedOrderedIds = selectedLocation.setSeqTarget ?? [];
            const orderedIds = mergeOrderedIds(
              remainingTargetsForLocation,
              storedOrderedIds.filter((targetId) => targetId !== id),
            );

            userStore.getState().updateLocationTargetOrder(targetToDelete.locationId, orderedIds);

            const orderMap = new Map(orderedIds.map((targetId, index) => [targetId, index]));

            nextCourseTargets.sort((a, b) => {
              const aIsCurrentLocation = a.locationId === targetToDelete.locationId;
              const bIsCurrentLocation = b.locationId === targetToDelete.locationId;

              if (aIsCurrentLocation && bIsCurrentLocation) {
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
          }

          return {
            courseTargets: nextCourseTargets,
          };
        }),
    }),
    {
      name: "courseTargets-ui-storage",
      partialize: (state) => ({
        isInactiveVisible: state.isInactiveVisible,
      }),
    },
  ),
);
