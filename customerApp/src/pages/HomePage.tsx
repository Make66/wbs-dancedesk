import { userStore } from "../stores/userStore";

const HomePage = () => {
  const user = userStore((state) => state.user);
  return (
    <div className="w-full h-screen bg-white dark:bg-gray-900">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="p-6">
        Herzlich Willkommen {user?.firstName} {user?.lastName}
      </div>
    </div>
  );
};

export default HomePage;
