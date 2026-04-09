import { useEffect, useState } from "react";
import { targetStore } from "../../stores/targetStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";

type Category = {
  id: string;
  name: string;
};

type TargetCoursesResponse = {
  id: string;
  name: string;
  categories: Category[];
};

const ShiftComponent = () => {
  const targets = targetStore((state) => state.targets);
  const [categoriesData, setCategoriesData] = useState<TargetCoursesResponse | null>(null);
  const [targetId, setTargetId] = useState<string>(targets[0]?.id ?? "");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const { setValue } = useFormContext<CourseFormValues>();

  useEffect(() => {
    if (!targetId) return;

    const fetchCategories = async (targetId: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/targets/${targetId}/courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Zielgruppe konnte nicht geladen werden.");
        }

        const data: TargetCoursesResponse = await response.json();
        console.log("Fetched categories for course:", data);

        setCategoriesData(data);
        setSelectedCategoryName("");
      } catch (error) {
        console.error("Error fetching categories for course:", error);
      }
    };

    fetchCategories(targetId);
  }, [targetId]);

  return (
    <div>
      <Popover>
        <PopoverTrigger className="w-full">
          <div className="h-22 w-full pl-6 bg-background/40 border border-muted-foreground rounded-t-2xl flex items-center cursor-pointer">
            {targets.find((target) => target.id === targetId)?.name || "Zielgruppe auswählen"}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] rounded-2xl p-4 text-foreground bg-background shadow-lg">
          {targets.map((target) => (
            <button
              key={target.id}
              className="w-full text-left p-2 hover:bg-muted-foreground cursor-pointer"
              onClick={() => {
                setTargetId(target.id);
              }}
            >
              {target.name}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger className="w-full">
          <div className="h-22 w-full pl-6 bg-background/40 border border-muted-foreground rounded-b-2xl flex items-center cursor-pointer">
            {selectedCategoryName || "Kategorie auswählen"}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] rounded-2xl p-4 text-foreground bg-background shadow-lg">
          {categoriesData?.categories?.map((category) => (
            <button
              key={category.id}
              className="w-full text-left p-2 hover:bg-muted-foreground cursor-pointer"
              onClick={() => {
                setSelectedCategoryName(category.name);
                console.log("Selected category:", category.id);
                setValue("categoryId", category.id);
              }}
            >
              {category.name}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ShiftComponent;
