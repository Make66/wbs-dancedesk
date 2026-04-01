import type { SVGProps } from "react";
import BongoIcon from "./BongoIcon";
import DrumIcon from "./DrumIcon";

export type AppIconName = "non" | "bongo" | "drum";
export type AppIconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export const appIcons: Record<AppIconName, AppIconComponent> = {
  non: () => null,
  bongo: BongoIcon,
  drum: DrumIcon,
};

export type IconProps = SVGProps<SVGSVGElement>;
