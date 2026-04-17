import { useState, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export type WidgetId = "stats" | "todays-courses" | "charts" | "bottom-row";

const DEFAULT_ORDER: WidgetId[] = ["stats", "todays-courses", "charts", "bottom-row"];
const STORAGE_KEY = "dashboard-widget-order";

function loadOrder(): WidgetId[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((id) => DEFAULT_ORDER.includes(id as WidgetId))) {
        return parsed as WidgetId[];
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_ORDER;
}

export function useDashboardLayout() {
  const [order, setOrder] = useState<WidgetId[]>(loadOrder);
  const [editMode, setEditMode] = useState(false);

  const handleDragEnd = useCallback((activeId: string, overId: string) => {
    setOrder((prev) => {
      const oldIndex = prev.indexOf(activeId as WidgetId);
      const newIndex = prev.indexOf(overId as WidgetId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetOrder = useCallback(() => {
    setOrder(DEFAULT_ORDER);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { order, editMode, setEditMode, handleDragEnd, resetOrder };
}
