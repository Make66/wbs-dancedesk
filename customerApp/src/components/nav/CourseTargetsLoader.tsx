import { useEffect } from "react";
import { locationStore } from "../../stores/locationStore";
import { targetStore } from "../../stores/targetStore";

const CourseTargetsLoader = () => {
  const selectedLocationId = locationStore((state) => state.selectedLocationId);

  const replaceTargets = targetStore((state) => state.replaceTargets);
  const clearTargets = targetStore((state) => state.clearTargets);
  const setLoading = targetStore((state) => state.setLoading);
  const setError = targetStore((state) => state.setError);

  useEffect(() => {
    if (!selectedLocationId) {
      console.log("No selectedLocationId -> clearing targets");
      clearTargets();
      return;
    }

    const loadTargets = async () => {
      console.log("Starting fetch...");

      try {
        setLoading(true);
        setError(null);
        clearTargets();

        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/locations/${selectedLocationId}/targets`,
        );

        if (!response.ok) {
          throw new Error("Zielgruppen konnten nicht geladen werden.");
        }

        const data = await response.json();

        console.log("targets loaded:", data);

        replaceTargets(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error instanceof Error ? error.message : "Fehler beim Laden der Zielgruppen.");
      } finally {
        setLoading(false);
      }
    };

    loadTargets();
  }, [selectedLocationId, replaceTargets, clearTargets, setLoading, setError]);

  return null;
};

export default CourseTargetsLoader;
