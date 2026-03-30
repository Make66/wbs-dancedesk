import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { locationStore } from "../../stores/locationStore";

const locationOptions = [
  {
    id: "cmn96gjn6001tirnp0kmvd84s",
    label: "Buehl",
    description: "",
  },
  {
    id: "cmn96gjnc001virnp0egrsn9u",
    label: "Achern",
    description: "",
  },
];

const LocationPicker = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const selectedLocationId = locationStore((state) => state.selectedLocationId);
  const setSelectedLocationId = locationStore((state) => state.setSelectedLocationId);

  useEffect(() => {
    if (!selectedLocationId) {
      setSelectedLocationId(locationOptions[0].id);
    }
  }, [selectedLocationId, setSelectedLocationId]);

  const selectedLocation = locationOptions.find((location) => location.id === selectedLocationId);

  const handleSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative mt-4 mb-5 w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-left text-gray-200 transition hover:bg-gray-600"
      >
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {selectedLocation?.label ?? "Standort wählen"}
            </span>
            {selectedLocation?.description && (
              <span className="text-xs text-gray-400">{selectedLocation.description}</span>
            )}
          </div>
        </div>

        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-600 bg-gray-800 p-2 shadow-lg">
          {locationOptions.map((location) => {
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
                    <span className="text-sm font-medium">{location.label}</span>
                    <span className="text-xs text-gray-400">{location.description}</span>
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
