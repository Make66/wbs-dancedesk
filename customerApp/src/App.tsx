import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import {
  HomePage,
  CoursesPage,
  CategoriesPage,
  LoginPage,
  InstructorsPage,
  UsersPage,
} from "./pages";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:targetId" element={<CategoriesPage />} />
          <Route path="/course/:categoryId" element={<div className="p-6">CourseDetailPage</div>} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/settings" element={<div className="p-6">SettingsPage</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
