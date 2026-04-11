import { MdDelete } from "react-icons/md";
import { cn } from "../../lib/utils";

type DeleteButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  tooltipPlace?: "top" | "right" | "bottom" | "left";
  tooltipContent?: string;
};

const DeleteButton = ({
  onClick,
  className,
  color,
  size,
  tooltipPlace,
  tooltipContent,
}: DeleteButtonProps) => {
  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={onClick}
      aria-label="löschen"
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltipContent || "löschen"}
      data-tooltip-place={tooltipPlace || "right"}
    >
      <MdDelete
        className={cn("text-2xl", size === "small" && "text-lg", size === "large" && "text-4xl")}
        style={{ color: color }}
      />
    </button>
  );
};

export default DeleteButton;
