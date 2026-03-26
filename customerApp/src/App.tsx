import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import { HomePage, CoursesPage, CourseCategoryPage } from "./pages";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseCategoryPage />} />
          <Route path="/users" element={<div className="p-6">UsersPage</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
