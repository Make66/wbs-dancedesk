import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { userStore } from "../../stores/userStore";

const LocationPicker = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = userStore((state) => state.user);
  const selectedLocationId = userStore((state) => state.selectedLocationId);
  const setSelectedLocationId = userStore((state) => state.setSelectedLocationId);

  const locations = useMemo(() => {
    if (!user) return [];

    return [...user.locations]
      .filter((location) => !location.isDeleted && location.active)
      .sort((a, b) => a.seq - b.seq);
  }, [user]);

  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      setSelectedLocationId(locations[0].id);
    }
  }, [selectedLocationId, locations, setSelectedLocationId]);

  const selectedLocation = useMemo(() => {
    return locations.find((location) => location.id === selectedLocationId) ?? null;
  }, [locations, selectedLocationId]);

  const handleSelect = (locationId: string) => {
    if (locationId === selectedLocationId) {
      setOpen(false);
      return;
    }

    setSelectedLocationId(locationId);
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative mb-5 mt-4 w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-left text-gray-200 transition hover:bg-gray-600"
      >
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {selectedLocation?.name ?? "Standort wählen"}
            </span>
          </div>
        </div>

        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-600 bg-gray-800 p-2 shadow-lg">
          {locations.map((location) => {
            const isSelected = location.id === selectedLocationId;

            return (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelect(location.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition ${
                  isSelected ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{location.name}</span>
                  </div>
                </div>

                {isSelected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
