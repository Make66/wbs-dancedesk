import { userStore } from "../stores/userStore";

const HomePage = () => {
  const user = userStore((state) => state.user);
  return (
    <div className="p-6 w-full bg-white">
      Herzlich Willkommen {user?.firstName} {user?.lastName}
    </div>
  );
};

export default HomePage;
