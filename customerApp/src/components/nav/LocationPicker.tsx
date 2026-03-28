import { useEffect } from "react";
import { locationStore } from "../../stores/locationStore";
import { useNavigate } from "react-router";

const locationOptions = [
  { id: "cmn96gjn6001tirnp0kmvd84s", label: "Buehl" },
  { id: "cmn96gjnc001virnp0egrsn9u", label: "Achern" },
];

const LocationPicker = () => {
  const navigate = useNavigate();
  const selectedLocationId = locationStore((state) => state.selectedLocationId);
  const setSelectedLocationId = locationStore((state) => state.setSelectedLocationId);

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
