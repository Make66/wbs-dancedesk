import { useEffect } from "react";
import { userStore } from "../../stores/userStore";
import { targetStore } from "../../stores/targetStore";
import { settingsStore } from "../../stores/settingsStore";
import { useAuth } from "../../context";

const DataLoader = () => {
  const authUser = useAuth().user;

  const selectedLocationId = userStore((state) => state.selectedLocationId);
  const setUser = userStore((state) => state.setUser);
  const clearUser = userStore((state) => state.clearUser);

  const replaceTargets = targetStore((state) => state.replaceTargets);
  const clearTargets = targetStore((state) => state.clearTargets);
  const setLoading = targetStore((state) => state.setLoading);
  const setError = targetStore((state) => state.setError);

  const setSettings = settingsStore((state) => state.setSettings);
  const setSettingsLoading = settingsStore((state) => state.setLoading);
  const setSettingsError = settingsStore((state) => state.setError);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`);

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Einstellungen.");
        }

        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSettingsError(
          error instanceof Error ? error.message : "Fehler beim Laden der Einstellungen.",
        );
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, [setSettings, setSettingsLoading, setSettingsError]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) {
        clearUser();
        clearTargets();
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/users/${authUser.id}`,
        );

        if (!response.ok) {
          throw new Error(`${response.status}. Something went wrong!`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError(error instanceof Error ? error.message : "Fehler beim Laden der Benutzerdaten.");
      }
    };

    fetchUserData();
  }, [authUser, setUser, clearUser, clearTargets, setError]);

  useEffect(() => {
    if (!selectedLocationId) {
      clearTargets();
      return;
    }

    const loadTargets = async () => {
      try {
        setLoading(true);
        setError(null);
        clearTargets();

        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/locations/${selectedLocationId}/targets`,
        );

        if (!response.ok) {
          throw new Error("Zielgruppen konnten nicht geladen werden.");
        }

        const data = await response.json();

        replaceTargets(data);
      } catch (error) {
        console.error("Fetch error with targets:", error);
        setError(error instanceof Error ? error.message : "Fehler beim Laden der Zielgruppen.");
      } finally {
        setLoading(false);
      }
    };

    loadTargets();
  }, [selectedLocationId, replaceTargets, clearTargets, setLoading, setError]);

  return null;
};

export default DataLoader;
