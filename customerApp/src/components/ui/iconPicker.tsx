import { useMemo, useRef, useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { Input } from "./input";
import { FaBook, FaUser, FaHeart, FaStar, FaHome, FaCamera, FaCog } from "react-icons/fa";
import type { IconType } from "react-icons";
import { cn } from "../../lib/utils";

type IconItem = {
  name: string;
  icon: IconType;
};

const ICONS: IconItem[] = [
  { name: "book", icon: FaBook },
  { name: "user", icon: FaUser },
  { name: "heart", icon: FaHeart },
  { name: "star", icon: FaStar },
  { name: "home", icon: FaHome },
  { name: "camera", icon: FaCamera },
  { name: "settings", icon: FaCog },
];

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedIcon = ICONS.find((item) => item.name === value);
  const SelectedIcon = selectedIcon?.icon ?? FaBook;

  const filteredIcons = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return ICONS;

    return ICONS.filter((item) => item.name.toLowerCase().includes(term));
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-md border bg-white shadow-sm"
        aria-label="Icon auswählen"
      >
        <SelectedIcon className="text-xl" />
      </button>

      {open && (
        <div className="absolute bottom-14 left-0 z-[80] w-[320px] rounded-2xl border bg-white p-3 shadow-2xl">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={search}
              placeholder="Icon suchen..."
              className="pl-9"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid max-h-[260px] grid-cols-4 gap-2 overflow-y-auto">
            {filteredIcons.map((item) => {
              const Icon = item.icon;
              const isSelected = item.name === value;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onChange(item.name);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative flex h-16 items-center justify-center rounded-xl border transition hover:bg-gray-50",
                    isSelected && "border-black bg-gray-100",
                  )}
                  title={item.name}
                >
                  {isSelected && <Check className="absolute right-1 top-1 h-3.5 w-3.5" />}
                  <Icon className="text-lg" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
