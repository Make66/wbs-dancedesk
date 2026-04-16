import { IoMdAddCircleOutline } from "react-icons/io";
import { cn } from "../../lib/utils";

type AddButtonProps = {
  onClick?: () => void;
  className?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  tooltipPlace?: "top" | "right" | "bottom" | "left";
  tooltipContent?: string;
};

const AddButton = ({
  onClick,
  className,
  size,
  color,
  tooltipPlace,
  tooltipContent,
}: AddButtonProps) => {
  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={onClick}
      aria-label="hinzufügen"
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltipContent || "hinzufügen"}
      data-tooltip-place={tooltipPlace || "right"}
    >
      <IoMdAddCircleOutline
        className={cn(
          "text-3xl",
          size === "small" && "text-lg",
          size === "medium" && "text-2xl",
          size === "large" && "text-4xl",
        )}
        style={{ color: color }}
      />
    </button>
  );
};

export default AddButton;
