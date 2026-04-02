"use client";

import { useMemo, useState } from "react";
import { Input } from "./input";
import {
  FaBook,
  FaUser,
  FaHeart,
  FaStar,
  FaShoppingCart,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaCog,
  FaCamera,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type IconItem = {
  name: string;
  icon: IconType;
};

const ICONS: IconItem[] = [
  { name: "book", icon: FaBook },
  { name: "user", icon: FaUser },
  { name: "heart", icon: FaHeart },
  { name: "star", icon: FaStar },
  { name: "shopping-cart", icon: FaShoppingCart },
  { name: "home", icon: FaHome },
  { name: "envelope", icon: FaEnvelope },
  { name: "phone", icon: FaPhone },
  { name: "settings", icon: FaCog },
  { name: "camera", icon: FaCamera },
];

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return ICONS;

    return ICONS.filter((item) => item.name.includes(term));
  }, [search]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Icon suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
        {filteredIcons.map((item) => {
          const Icon = item.icon;
          const isSelected = value === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onChange(item.name)}
              className={`flex h-20 flex-col items-center justify-center rounded-md border p-2 transition hover:bg-muted ${
                isSelected ? "border-primary bg-muted" : "border-border"
              }`}
            >
              <Icon className="mb-2 h-5 w-5" />
              <span className="text-xs text-center">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
