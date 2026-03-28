import { useEffect } from "react";
import { useLocationsStore } from "../../stores/useLocationsStore";
import { useCourseTargetsStore } from "../../stores/useCourseTargetsStore";

const CourseTargetsLoader = () => {
  const selectedLocationId = useLocationsStore((state) => state.selectedLocationId);

  const replaceCourseTargets = useCourseTargetsStore((state) => state.replaceCourseTargets);
  const clearCourseTargets = useCourseTargetsStore((state) => state.clearCourseTargets);
  const setLoading = useCourseTargetsStore((state) => state.setLoading);
  const setError = useCourseTargetsStore((state) => state.setError);

  useEffect(() => {
    if (!selectedLocationId) {
      console.log("No selectedLocationId -> clearing targets");
      clearCourseTargets();
      return;
    }

    const loadCourseTargets = async () => {
      console.log("Starting fetch...");

      try {
        setLoading(true);
        setError(null);
        clearCourseTargets();

        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/locations/${selectedLocationId}/targets`,
        );

        if (!response.ok) {
          throw new Error("Zielgruppen konnten nicht geladen werden.");
        }

        const data = await response.json();

        replaceCourseTargets(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error instanceof Error ? error.message : "Fehler beim Laden der Zielgruppen.");
      } finally {
        setLoading(false);
      }
    };

    loadCourseTargets();
  }, [selectedLocationId, replaceCourseTargets, clearCourseTargets, setLoading, setError]);

  return null;
};

export default CourseTargetsLoader;
