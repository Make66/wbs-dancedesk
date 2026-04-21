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
  CourseDetailPage,
  SettingsPage,
  CalendarPage,
  InstructorDetailPage,
  RoomDetailPage,
  ParticipantsDetailPage,
  PostsPage,
  PostDetailPage,
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
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:targetId" element={<CategoriesPage />} />
            <Route path="/course" element={<CourseDetailPage />} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/participants" element={<ParticipantsPage />} />
            <Route path="/participant/:id" element={<ParticipantsDetailPage />} />
            <Route path="/room/:roomId" element={<RoomDetailPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/instructor/:instructorId" element={<InstructorDetailPage />} />
            <Route path="/instructor" element={<InstructorDetailPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/post" element={<PostDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Tooltip id="tooltip" className="custom-tooltip z-[200]" delayShow={200} delayHide={200} />
      <Tooltip
        id="calendar-item-tooltip"
        className="z-300 p-0! rounded-xl! bg-popover! text-popover-foreground! shadow-xl border! border-border!"
        delayShow={400}
        delayHide={100}
        render={({ activeAnchor }) => {
          const title = activeAnchor?.getAttribute("data-item-title");
          const time = activeAnchor?.getAttribute("data-item-time");
          const description = activeAnchor?.getAttribute("data-item-description");
          const location = activeAnchor?.getAttribute("data-item-location");
          if (!title) return null;
          return (
            <div className="p-3 min-w-50 max-w-70 flex flex-col gap-1">
              <p className="font-semibold text-sm leading-tight">{title}</p>
              {time && <p className="text-xs text-muted-foreground">{time}</p>}
              {description && <p className="text-xs mt-1 leading-snug">{description}</p>}
              {location && <p className="text-xs text-muted-foreground mt-1">{location}</p>}
            </div>
          );
        }}
      />
    </>
  );
}

export default App;
