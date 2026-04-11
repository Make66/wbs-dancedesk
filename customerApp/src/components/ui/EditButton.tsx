import { FaPenNib } from "react-icons/fa6";
import { cn } from "../../lib/utils";

type EditButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  color?: string;
  size?: "tiny" | "small" | "medium" | "large";
  tooltipPlace?: "top" | "right" | "bottom" | "left";
  tooltipContent?: string;
};

const EditButton = ({
  onClick,
  className,
  color,
  size,
  tooltipPlace,
  tooltipContent,
}: EditButtonProps) => {
  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={onClick}
      aria-label="bearbeiten"
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltipContent || "bearbeiten"}
      data-tooltip-place={tooltipPlace || "right"}
    >
      <FaPenNib
        className={cn(
          "text-2xl",
          size === "tiny" && "text-base",
          size === "small" && "text-lg",
          size === "large" && "text-4xl",
        )}
        style={{ color: color }}
      />
    </button>
  );
};

export default EditButton;
