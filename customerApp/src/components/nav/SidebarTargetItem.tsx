import { NavLink } from "react-router";
import type { Target } from "../../types/course-types";
import { cn } from "../../lib/utils";
import { getIconComponent } from "../../lib/constants/icon-constants";

type SidebarTargetItemProps = {
  target: Target;
  className?: string;
};

const SidebarTargetItem = ({ target, className }: SidebarTargetItemProps) => {
  return (
    <NavLink
      to={`/courses/${target.id}`}
      state={{ target }}
      key={target.id}
      style={
        {
          "--hover-color-back": target.color[0],
          "--hover-color-text": target.color[1],
        } as React.CSSProperties
      }
      className={({ isActive }) =>
        cn(
          "group my-2 block rounded-xl py-4 pl-6 cursor-pointer transition-colors duration-200",
          className,
          isActive
            ? "bg-[var(--hover-color-back)] text-[var(--hover-color-text)]"
            : "text-gray-400 hover:bg-[var(--hover-color-back)] hover:text-[var(--hover-color-text)]",
        )
      }
    >
      <div className="flex items-center gap-2.5">
        {target.icon &&
          (() => {
            const Icon = getIconComponent(target.icon);

            return (
              <Icon className="text-base transition-transform duration-200 ease-out group-hover:scale-110" />
            );
          })()}

        <span className="text-sm font-medium leading-none">{target.name}</span>
      </div>
    </NavLink>
  );
};

export default SidebarTargetItem;
