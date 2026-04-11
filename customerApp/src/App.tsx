import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  HomePage,
  CoursesPage,
  CategoriesPage,
  LoginPage,
  InstructorsPage,
  ParticipantsPage,
  TargetsPage,
  CourseDetailPage,
  RoomsPage,
  SettingsPage,
  CalendarPage,
  InstructorDetailPage,
} from "./pages";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/targets" element={<TargetsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:targetId" element={<CategoriesPage />} />
            <Route path="/course" element={<CourseDetailPage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/participants" element={<ParticipantsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/instructor/:instructorId" element={<InstructorDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Tooltip id="tooltip" className="custom-tooltip z-[200]" delayShow={200} delayHide={200} />
    </>
  );
}

export default App;
