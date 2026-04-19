import CalendarSettingsSection from "../components/settings/CalenderSettingsSection";
import HolidaySettingSection from "../components/settings/HolidaySettingSection";
import FederalHolidaySettingsSection from "../components/settings/FederalHolidaySettingsSection";
import TargetSettingsSection from "../components/settings/TargetSettingsSection";
import RoomSettingsSection from "../components/settings/RoomSettingsSection";
import InstructorSettingsSection from "../components/settings/InstructorSettingsSection";
import OtherSettingsSection from "../components/settings/OtherSettingsSection";
import RegistrationSettingsSection from "../components/settings/RegistrationSettingsSection";
import RebateSettingsSection from "../components/settings/RebateSettingsSection";

const SettingsPage = () => {
  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-muted-foreground bg-background pl-6 z-20">
        <h1 className="text-3xl font-semibold">Einstellungen</h1>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <TargetSettingsSection />
          <RoomSettingsSection />
          <InstructorSettingsSection />
          <CalendarSettingsSection />
          <FederalHolidaySettingsSection />
          <HolidaySettingSection />
          <RegistrationSettingsSection />
          <RebateSettingsSection />
          <OtherSettingsSection />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
