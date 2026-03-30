import { Link } from "react-router";

const CoursesPage = () => {
  return (
    <div className="w-full bg-white">
      <div className="pl-6 h-20 border-b border-gray-400 flex items-center gap-9">
        <h1 className="text-3xl font-semibold">Kursplan</h1>
      </div>
      <div className="p-6 mt-3">
        <p>Hier kommt der Wochenplan rein</p>
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

export default CoursesPage;
