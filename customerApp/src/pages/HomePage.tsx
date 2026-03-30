import { userStore } from "../stores/userStore";

const HomePage = () => {
  const user = userStore((state) => state.user);
  return (
    <div className="w-full bg-white">
      <div className="pl-6 h-20 border-b border-gray-400 flex items-center justify-start">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="p-6">
        Herzlich Willkommen {user?.firstName} {user?.lastName}
      </div>
    </div>
  );
};

export default HomePage;
