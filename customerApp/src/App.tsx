import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import { HomePage, CoursesPage, CourseCategoriesPage, LoginPage } from "./pages";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:categoryId" element={<CourseCategoriesPage />} />
          <Route path="/course/:categoryId" element={<div className="p-6">CourseDetailPage</div>} />
          <Route path="/users" element={<div className="p-6">UsersPage</div>} />
          <Route path="/instructors" element={<div className="p-6">InstructorsPage</div>} />
          <Route path="/settings" element={<div className="p-6">SettingsPage</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
