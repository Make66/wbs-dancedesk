import { Link } from "react-router";

const SettingsPage = () => {
  return (
    <div className="w-full h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Einstellungen</h1>
      </div>
      <div className="p-6">
        <Link to="/targets" className="flex items-center gap-2 text-blue-500 mt-6">
          ZIELGRUPPEN VERWALTEN
        </Link>
        <Link to="/rooms" className="flex items-center gap-2 text-blue-500 mt-3">
          RÄUME VERWALTEN
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
