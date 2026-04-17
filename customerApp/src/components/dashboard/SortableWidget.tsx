import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical } from "react-icons/lu";

interface SortableWidgetProps {
  id: string;
  editMode: boolean;
  children: React.ReactNode;
}

const SortableWidget = ({ id, editMode, children }: SortableWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {editMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing
            flex items-center justify-center w-7 h-10 rounded-md
            bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground
            border border-border shadow-sm transition-colors"
          title="Verschieben"
        >
          <LuGripVertical size={16} />
        </div>
      )}
      <div className={editMode ? "ring-2 ring-primary/30 rounded-xl transition-all" : ""}>
        {children}
      </div>
    </div>
  );
};

export default SortableWidget;
