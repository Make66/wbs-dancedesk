import { useEffect } from "react";
import { useLocationsStore } from "../../stores/useLocationsStore";
import { useNavigate } from "react-router";

const locationOptions = [
  { id: "cmn96gjn6001tirnp0kmvd84s", label: "Buehl" },
  { id: "cmn96gjnc001virnp0egrsn9u", label: "Achern" },
];

const LocationPicker = () => {
  const navigate = useNavigate();
  const selectedLocationId = useLocationsStore((state) => state.selectedLocationId);
  const setSelectedLocationId = useLocationsStore((state) => state.setSelectedLocationId);

  useEffect(() => {
    if (!selectedLocationId) {
      setSelectedLocationId(locationOptions[0].id);
    }
    navigate(`/`);
  }, [selectedLocationId, setSelectedLocationId]);

  return (
    <select
      value={selectedLocationId ?? ""}
      onChange={(e) => setSelectedLocationId(e.target.value)}
    >
      {locationOptions.map((location) => (
        <option key={location.id} value={location.id}>
          {location.label}
        </option>
      ))}
    </select>
  );
};

export default LocationPicker;
