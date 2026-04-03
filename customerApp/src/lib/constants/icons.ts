import {
  FaBook,
  FaUser,
  FaHeart,
  FaStar,
  FaHome,
  FaAccessibleIcon,
  FaBaby,
  FaBabyCarriage,
  FaFemale,
  FaMale,
  FaItunesNote,
  FaLightbulb,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type IconItem = {
  name: string;
  icon: IconType;
};

export const ICONS: IconItem[] = [
  { name: "book", icon: FaBook },
  { name: "user", icon: FaUser },
  { name: "heart", icon: FaHeart },
  { name: "star", icon: FaStar },
  { name: "home", icon: FaHome },
  { name: "accessible", icon: FaAccessibleIcon },
  { name: "baby", icon: FaBaby },
  { name: "babyCarriage", icon: FaBabyCarriage },
  { name: "female", icon: FaFemale },
  { name: "male", icon: FaMale },
  { name: "music", icon: FaItunesNote },
  { name: "lightbulb", icon: FaLightbulb },
];

export function getIconComponent(iconName?: string): IconType {
  const icon = ICONS.find((item) => item.name === iconName);
  return icon?.icon ?? FaBook;
}
