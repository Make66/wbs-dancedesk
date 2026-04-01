/**
 * Updates an entity in a list by its ID
 * @param items The list of entities
 * @param id The ID of the entity to update
 * @param updates The updates to apply
 * @returns The updated list of entities
 */
export const updateEntityById = <T extends { id: string; updatedAt: string }>(
  items: T[],
  id: string,
  updates: Partial<T>,
) => {
  return items.map((item) =>
    item.id === id
      ? {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );
};

export const getItemsForParent = <T extends { isDeleted: boolean }>(
  items: T[],
  isInParent: (item: T) => boolean,
) => {
  return items.filter((item) => !item.isDeleted && isInParent(item));
};
