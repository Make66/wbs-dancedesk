import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { Target } from "../types/course-types";
import { userStore } from "./userStore";
import type { UpdateTargetInput, CreateTargetInput } from "../types/course-types";
import {
  sortEntitiesByOrderedIds,
  mergeOrderedIds,
  filterNotDeleted,
  sortByActiveStatus,
  sortEntitiesForContext,
} from "../lib/courses/sorting-utils";
import { updateEntityById, getItemsForParent } from "../lib/courses/collection-utils";

type TargetStore = {
  targets: Target[];
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

const getSelectedLocation = () => userStore.getState().getActiveLocation();

export const targetStore = create<TargetStore>()(
  persist(
    (set, get) => ({
      targets: [],
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
          const existingIds = new Set(state.targets.map((item) => item.id));

          const updatedTargets = state.targets.map((item) => targetMap.get(item.id) ?? item);
          const newTargets = targets.filter((t) => !existingIds.has(t.id));

          return {
            targets: filterNotDeleted([...updatedTargets, ...newTargets]),
            error: null,
          };
        }),

      replaceTargets: (targets) =>
        set(() => {
          const selectedLocation = userStore.getState().getActiveLocation();
          const filteredTargets = filterNotDeleted(targets);

          if (!selectedLocation) {
            return {
              targets: filteredTargets,
              error: null,
            };
          }

          const storedOrderedIds = selectedLocation.setSeqTarget ?? [];
          const targetsForLocation = getItemsForParent(
            filteredTargets,
            (item) => item.locationId === selectedLocation.id,
          );

          const mergedOrderedIds = mergeOrderedIds(targetsForLocation, storedOrderedIds);

          const sortedTargets = sortEntitiesForContext(
            filteredTargets,
            mergedOrderedIds,
            (item) => item.locationId === selectedLocation.id,
          );

          return {
            targets: sortedTargets,
            error: null,
          };
        }),

      clearTargets: () =>
        set({
          targets: [],
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
        const { targets, isInactiveVisible } = get();
        const selectedLocation = getSelectedLocation();

        if (!selectedLocation) return [];

        const targetsForLocation = getItemsForParent(
          targets,
          (item) => item.locationId === selectedLocation.id,
        );
        const storedOrderedIds = selectedLocation.setSeqTarget ?? [];

        const targetsVisible = isInactiveVisible
          ? targetsForLocation
          : targetsForLocation.filter((item) => item.active);

        return sortEntitiesByOrderedIds(targetsVisible, storedOrderedIds);
      },

      getOrderedTargetIds: () => {
        const { targets } = get();
        const selectedLocation = getSelectedLocation();

        if (!selectedLocation) return [];

        return targets
          .filter((item) => item.locationId === selectedLocation.id && !item.isDeleted)
          .map((item) => item.id);
      },

      toggleTargetActive: (id, active) =>
        set((state) => {
          const updatedTargets = state.targets.map((item) =>
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
            return { targets: updatedTargets };
          }

          const locationTargets = getItemsForParent(
            updatedTargets,
            (item) => item.locationId === selectedLocation.id,
          );
          const storedOrderedIds = selectedLocation.setSeqTarget ?? [];
          const sortedTargets = sortByActiveStatus(locationTargets, storedOrderedIds);
          const orderedIds = sortedTargets.map((item) => item.id);

          userStore.getState().updateLocationTargetOrder(selectedLocation.id, orderedIds);

          const reorderedCourseTargets = sortEntitiesForContext(
            updatedTargets,
            orderedIds,
            (item) => item.locationId === selectedLocation.id,
          );

          return {
            targets: reorderedCourseTargets,
          };
        }),

      reorderTargets: (activeId, overId) =>
        set((state) => {
          const selectedLocation = getSelectedLocation();
          if (!selectedLocation) return state;

          const locationTargets = getItemsForParent(
            state.targets,
            (item) => item.locationId === selectedLocation.id,
          );
          const storedOrderedIds = selectedLocation.setSeqTarget ?? [];

          const activeTargets = sortEntitiesByOrderedIds(
            locationTargets.filter((item) => item.active),
            storedOrderedIds,
          );

          const inactiveTargets = sortEntitiesByOrderedIds(
            locationTargets.filter((item) => !item.active),
            storedOrderedIds,
          );

          const oldIndex = activeTargets.findIndex((item) => item.id === activeId);
          const newIndex = activeTargets.findIndex((item) => item.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const reorderedActiveTargets = arrayMove(activeTargets, oldIndex, newIndex);
          const orderedIds = [...reorderedActiveTargets, ...inactiveTargets].map((item) => item.id);

          userStore.getState().updateLocationTargetOrder(selectedLocation.id, orderedIds);

          const reorderedCourseTargets = sortEntitiesForContext(
            state.targets,
            orderedIds,
            (item) => item.locationId === selectedLocation.id,
          );

          return {
            targets: reorderedCourseTargets.map((item) =>
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

          const nextTargets = [newTarget, ...state.targets];

          const selectedLocation = userStore
            .getState()
            .user?.locations.find((loc) => loc.id === locationId);

          if (selectedLocation) {
            const locationTargets = getItemsForParent(
              nextTargets,
              (item) => item.locationId === locationId,
            );
            const storedOrderedIds = selectedLocation.setSeqTarget ?? [];

            const orderedIds = [
              newTarget.id,
              ...mergeOrderedIds(locationTargets, storedOrderedIds).filter(
                (id) => id !== newTarget.id,
              ),
            ];

            userStore.getState().updateLocationTargetOrder(locationId, orderedIds);

            const reorderedTargets = sortEntitiesForContext(
              nextTargets,
              orderedIds,
              (item) => item.locationId === locationId,
            );

            return {
              targets: reorderedTargets,
            };
          }

          return {
            targets: nextTargets,
          };
        }),

      updateTarget: (id, data) =>
        set((state) => ({
          targets: updateEntityById(state.targets, id, data),
        })),

      updateColor: (id, color) =>
        set((state) => ({
          targets: updateEntityById(state.targets, id, { color }),
        })),

      updateIcon: (id, icon) =>
        set((state) => ({
          targets: updateEntityById(state.targets, id, { icon }),
        })),

      replaceTemporaryTarget: (tempId, createdTarget) =>
        set((state) => {
          const nextTargets = state.targets.map((item) =>
            item.id === tempId
              ? {
                  ...createdTarget,
                  isNew: false,
                }
              : item,
          );

          const selectedLocation = userStore
            .getState()
            .user?.locations.find((loc) => loc.id === createdTarget.locationId);

          if (selectedLocation) {
            const nextOrderedIds = (selectedLocation.setSeqTarget ?? []).map((id) =>
              id === tempId ? createdTarget.id : id,
            );

            userStore
              .getState()
              .updateLocationTargetOrder(createdTarget.locationId, nextOrderedIds);

            const reorderedTargets = sortEntitiesForContext(
              nextTargets,
              nextOrderedIds,
              (item) => item.locationId === createdTarget.locationId,
            );

            return {
              targets: reorderedTargets,
            };
          }

          return {
            targets: nextTargets,
          };
        }),

      deleteTarget: (id) =>
        set((state) => {
          const targetToDelete = state.targets.find((item) => item.id === id);
          if (!targetToDelete) return state;

          const nextTargets = state.targets.filter((item) => item.id !== id);
          const selectedLocation = userStore
            .getState()
            .user?.locations.find((loc) => loc.id === targetToDelete.locationId);

          if (selectedLocation) {
            const remainingTargetsForLocation = getItemsForParent(
              nextTargets,
              (item) => item.locationId === targetToDelete.locationId,
            );

            const storedOrderedIds = selectedLocation.setSeqTarget ?? [];
            const orderedIds = mergeOrderedIds(
              remainingTargetsForLocation,
              storedOrderedIds.filter((targetId) => targetId !== id),
            );

            userStore.getState().updateLocationTargetOrder(targetToDelete.locationId, orderedIds);

            const reorderedTargets = sortEntitiesForContext(
              nextTargets,
              orderedIds,
              (item) => item.locationId === targetToDelete.locationId,
            );

            return {
              targets: reorderedTargets,
            };
          }

          return {
            targets: nextTargets,
          };
        }),
    }),
    {
      name: "targets-ui-storage",
      partialize: (state) => ({
        isInactiveVisible: state.isInactiveVisible,
      }),
    },
  ),
);
