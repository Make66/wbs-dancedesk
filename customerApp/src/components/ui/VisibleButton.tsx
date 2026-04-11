import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { cn } from "../../lib/utils";

type VisibleButtonProps = {
  onClick: () => void;
  isVisible: boolean;
  className?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  tooltipPlace?: "top" | "right" | "bottom" | "left";
  tooltipContent?: string;
};

const VisibleButton = ({
  onClick,
  isVisible,
  className,
  color,
  size,
  tooltipPlace,
  tooltipContent,
}: VisibleButtonProps) => {
  return (
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={onClick}
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltipContent || "anzeigen/verbergen"}
      data-tooltip-place={tooltipPlace || "right"}
    >
      {isVisible ? (
        <IoMdEyeOff
          className={cn(
            "text-3xl",
            size === "small" ? "text-lg" : size === "large" ? "text-4xl" : "text-3xl",
          )}
          style={{ color: color }}
        />
      ) : (
        <IoMdEye
          className={cn(
            "text-3xl",
            size === "small" ? "text-lg" : size === "large" ? "text-4xl" : "text-3xl",
          )}
          style={{ color: color }}
        />
      )}
    </button>
  );
};

export default VisibleButton;
