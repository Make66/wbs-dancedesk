import type { Course } from "../../types/course-types";
import { addMinutes, format } from "date-fns";
import { de } from "date-fns/locale";
import { FaCalendarAlt, FaHourglass } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import { findNextCourseDate, getCourseDuration } from "../../lib/courses/course";

type CourseInfoProps = {
  course?: Course;
  participantsStats: {
    total: number;
    male: number;
    female: number;
    other: number;
    maleAverage: number;
    femaleAverage: number;
    otherAverage: number;
    totalAverage: number;
  };
};

const CourseInfo = ({ course, participantsStats }: CourseInfoProps) => {
  const nextDate = findNextCourseDate(course);
  const minutes =
    course?.startsAt && course?.endsAt ? getCourseDuration(course.startsAt, course.endsAt) : 0;

  const endTime = nextDate ? addMinutes(nextDate, minutes) : null;

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 rounded-2xl border border-muted-foreground bg-background/40 px-6 py-4">
      <div className="col-span-2 2xl:col-span-1 mt-2">
        <span className="text-md">Nächster Kurs</span>
        <div className="flex items-center mt-3 gap-4 text-muted-foreground">
          <WiDaySunny className="inline mr-2 text-md" />
          <span className="text-md text-muted-foreground">
            {nextDate ? format(nextDate, "EEEE", { locale: de }) : "Kein weiterer Termin"}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <FaCalendarAlt className="inline mr-2 text-md" />
          <span className="text-md text-muted-foreground">
            {nextDate ? format(nextDate, "dd. MMMM yyyy", { locale: de }) : "Kein weiterer Termin"}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <FaClock className="inline mr-2 text-md" />
          <span className="text-md text-muted-foreground">
            {nextDate && endTime
              ? `${format(nextDate, "HH:mm", { locale: de })} - ${format(endTime, "HH:mm", {
                  locale: de,
                })}`
              : "Keine Uhrzeit verfügbar"}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <FaHourglass className="inline mr-2 text-md" />
          <span className="text-md text-muted-foreground">
            {minutes ? `${minutes} Minuten` : "Keine Uhrzeit verfügbar"}
          </span>
        </div>
      </div>
      <div className="hidden 2xl:flex flex-col col-span-1 mt-2">
        <span className="text-md">Statistiken</span>
        <span className="mt-3 text-md text-muted-foreground">
          {participantsStats.total} total &#8960; {participantsStats.totalAverage} Jahre
        </span>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <span className="text-md text-muted-foreground">
            {participantsStats.male} männlich &#8960; {participantsStats.maleAverage} Jahre
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <span className="text-md text-muted-foreground">
            {participantsStats.female} weiblich &#8960; {participantsStats.femaleAverage} Jahre
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <span className="text-md text-muted-foreground">
            {participantsStats.other} divers &#8960; {participantsStats.otherAverage} Jahre
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
