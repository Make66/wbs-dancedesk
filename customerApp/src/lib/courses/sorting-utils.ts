type SortableEntity = {
  id: string;
  createdAt: string;
  isActive: boolean;
};

type EntityWithId = {
  id: string;
};

/**
 * Utility function to sort entities based on a provided order of IDs.
 * Active entities are prioritized over inactive ones, and within each group,
 * entities are sorted according to the provided order of IDs. Entities not
 * included in the order are sorted by their creation date.
 * @param items - The array of entities to be sorted.
 * @param orderedIds - An array of IDs representing the desired order of entities.
 * @returns A new array of entities sorted according to the specified criteria.
 */
export const sortEntitiesByOrderedIds = <T extends SortableEntity>(
  items: T[],
  orderedIds: string[] = [],
) => {
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

  return [...items].sort((a, b) => {
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
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

/**
 * Merges a list of entities with an ordered list of IDs, ensuring that all entities are included in the resulting order.
 * Entities that are not present in the ordered list will be appended at the end, maintaining their original order.
 * @param items - The array of entities to be merged.
 * @param orderedIds - An array of IDs representing the desired order of entities.
 * @returns An array of entity IDs sorted according to the specified order, with missing entities appended at the end.
 */
export const mergeOrderedIds = <T extends EntityWithId>(items: T[], orderedIds: string[] = []) => {
  const validIds = new Set(items.map((item) => item.id));

  const existingOrderedIds = orderedIds.filter((id) => validIds.has(id));
  const missingIds = items
    .filter((item) => !existingOrderedIds.includes(item.id))
    .map((item) => item.id);

  return [...existingOrderedIds, ...missingIds];
};

/**
 * Filters out deleted entities from a list.
 * @param items - The array of entities to be filtered, where each entity has an `isDeleted` boolean property.
 * @returns A new array containing only the entities that are not marked as deleted.
 */
export const filterNotDeleted = <T extends { isDeleted: boolean }>(items: T[]) => {
  return items.filter((item) => !item.isDeleted);
};

/**
 * Sorts entities by their active status, with active entities appearing first.
 * @param items - The array of entities to be sorted.
 * @param orderedIds - An array of IDs representing the desired order of entities.
 * @returns A new array of entities sorted by active status and then by the specified order.
 */
export const sortByActiveStatus = <T extends SortableEntity>(
  items: T[],
  orderedIds: string[] = [],
) => {
  const activeItems = items.filter((item) => item.isActive);
  const inactiveItems = items.filter((item) => !item.isActive);

  return [
    ...sortEntitiesByOrderedIds(activeItems, orderedIds),
    ...sortEntitiesByOrderedIds(inactiveItems, orderedIds),
  ];
};

/**
 * Sorts entities for a specific context, prioritizing those that are in the current context.
 * @param items - The array of entities to be sorted.
 * @param orderedIds - An array of IDs representing the desired order of entities.
 * @param isInCurrentContext - A function to determine if an entity is in the current context.
 * @returns A new array of entities sorted by their context and then by the specified order.
 */
export const sortEntitiesForContext = <T extends SortableEntity>(
  items: T[],
  orderedIds: string[],
  isInCurrentContext: (item: T) => boolean,
) => {
  const contextItems = items.filter(isInCurrentContext);
  const otherItems = items.filter((item) => !isInCurrentContext(item));

  return [...sortEntitiesByOrderedIds(contextItems, orderedIds), ...otherItems];
};
