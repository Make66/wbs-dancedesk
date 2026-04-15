import CalendarSettingsSection from "../components/settings/CalenderSettingsSection";
import TargetSettingsSection from "../components/settings/TargetSettingsSection";
import { Link } from "react-router";

const SettingsPage = () => {
  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-muted-foreground bg-background pl-6 z-20">
        <h1 className="text-3xl font-semibold">Einstellungen</h1>
      </div>
      <div className="p-6">
        <Link to="/rooms" className="flex items-center gap-2 text-blue-500 mt-3">
          RÄUME VERWALTEN
        </Link>
        <div className="flex flex-col gap-4">
          <TargetSettingsSection />
          <CalendarSettingsSection />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
