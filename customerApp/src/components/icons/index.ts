import type { SVGProps } from "react";
import BongoIcon from "./BongoIcon";
import DrumIcon from "./DrumIcon";

export type AppIconName = "bongo" | "drum";
export type AppIconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export const appIcons: Record<AppIconName, AppIconComponent> = {
  bongo: BongoIcon,
  drum: DrumIcon,
};

export type IconProps = SVGProps<SVGSVGElement>;
