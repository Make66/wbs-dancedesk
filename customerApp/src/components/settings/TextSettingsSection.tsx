import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight, FileText } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import AddButton from "../ui/AddButton";
import { getTexts } from "../../data/text";
import type { TextItem } from "../../types/text-types";

type TypeFilter = "alle" | "agb" | "info";

const TYPE_LABELS: Record<number, string> = { 0: "AGB", 1: "Info" };

const TextSettingsSection = () => {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("alle");

  useEffect(() => {
    getTexts().then(setTexts).catch(console.error);
  }, []);

  const filtered = texts.filter((t) => {
    if (typeFilter === "agb") return t.type === 0;
    if (typeFilter === "info") return t.type === 1;
    return true;
  });

  const filterBtn = (value: TypeFilter) =>
    `px-3 h-8 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
      typeFilter === value
        ? "bg-emerald-500 text-white border-emerald-500"
        : "bg-background/40 text-muted-foreground border-muted-foreground"
    }`;

  return (
    <div className="p-4 bg-emerald-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4 ml-2">
          <FileText className="w-6 h-6" />
          <h3 className="text-2xl font-semibold">Texte</h3>
        </div>
        <div className="flex items-center gap-3">
          {isOpen && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={filterBtn("alle")}
                onClick={() => setTypeFilter("alle")}
              >
                Alle
              </button>
              <button
                type="button"
                className={filterBtn("agb")}
                onClick={() => setTypeFilter("agb")}
              >
                AGB
              </button>
              <button
                type="button"
                className={filterBtn("info")}
                onClick={() => setTypeFilter("info")}
              >
                Info
              </button>
            </div>
          )}
          {isOpen && (
            <div onClick={(e) => e.stopPropagation()}>
              <Link to="/text">
                <AddButton tooltipContent="Text hinzufügen" size="medium" />
              </Link>
            </div>
          )}
          {isOpen ? (
            <RiArrowUpSLine className="text-2xl mr-2" />
          ) : (
            <RiArrowDownSLine className="text-2xl mr-2" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground pl-2">
              Keine Texte vorhanden. Klicke auf „+" um einen Text hinzuzufügen.
            </p>
          ) : (
            filtered.map((text) => (
              <Link key={text.id} to={`/text/${text.id}`} state={{ text }}>
                <div className="rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-5 py-3 gap-4 hover:bg-emerald-500 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium truncate">{text.name}</p>
                    {text.description && (
                      <p className="text-sm text-muted-foreground truncate">{text.description}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-lg border border-muted-foreground bg-background/40 shrink-0">
                    {TYPE_LABELS[text.type] ?? text.type}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TextSettingsSection;
