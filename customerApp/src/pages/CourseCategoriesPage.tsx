import CourseCategory from "../components/courses/CourseCategory";

const category = {
  id: "a366b74b-9665-439e-92cf-5919d79a8ec0",
  name: "Salsa",
  color: "#60a5fa",
  categories: [
    {
      id: "1b3f1f24-56c1-4937-b602-bca0415a2c8b",
      name: "Anfänger",
      courses: [
        {
          id: "1b3f1f24-56c1-4937-b602-bca0415a2c8b",
          seq: 1,
          name: "Salsa für Anfänger 1",
          description: "Lerne die Grundlagen des Salsa-Tanzens in diesem Einsteigerkurs.",
          startsAt: "2026-04-21T13:00:00Z",
          repeat: 4,
          frequency: "weekly",
          seatsCurrent: 8,
          seatsMax: 15,
          paymentTypes: ["cash", "paypal"],
          contractTypes: ["monthly", "one-time"],
          price: 49.99,
          duration: 60,
        },
        {
          id: "9a80aa4b-49f3-4b06-9ccd-64719232f4bb",
          seq: 2,
          name: "Salsa für Anfänger 2",
          description: "Lerne die Grundlagen des Salsa-Tanzens in diesem Einsteigerkurs.",
          startsAt: "2026-04-23T16:00:00Z",
          repeat: 4,
          frequency: "weekly",
          seatsCurrent: 12,
          seatsMax: 15,
          paymentTypes: ["cash", "paypal"],
          contractTypes: ["monthly", "one-time"],
          price: 49.99,
          duration: 60,
        },
      ],
    },
    {
      id: "2c3d4e5f-6789-4a0b-9cde-1234567890ab",
      name: "Fortgeschrittene",
      courses: [
        {
          id: "2c3d4e5f-6789-4a0b-9cde-1234567890ab",
          seq: 1,
          name: "Salsa für Fortgeschrittene 1",
          description: "Vertiefe deine Salsa-Kenntnisse in diesem Kurs für Fortgeschrittene.",
          startsAt: "2026-04-22T18:00:00Z",
          repeat: 4,
          frequency: "weekly",
          seatsCurrent: 10,
          seatsMax: 15,
          paymentTypes: ["cash", "paypal"],
          contractTypes: ["monthly", "one-time"],
          price: 59.99,
          duration: 60,
        },
        {
          id: "3d4e5f67-8901-4a0b-9cde-1234567890cd",
          seq: 2,
          name: "Salsa für Fortgeschrittene 2",
          description: "Vertiefe deine Salsa-Kenntnisse in diesem Kurs für Fortgeschrittene.",
          startsAt: "2026-04-24T19:00:00Z",
          repeat: 4,
          frequency: "weekly",
          seatsCurrent: 14,
          seatsMax: 15,
          paymentTypes: ["cash", "paypal"],
          contractTypes: ["monthly", "one-time"],
          price: 59.99,
          duration: 60,
        },
      ],
    },
  ],
};

const CourseCategoriesPage = () => {
  // const { courseId } = useParams();

  return (
    <div className="p-6">
      <h1 className="mb-10 text-3xl font-semibold">{category.name}</h1>
      <div className="flex flex-col gap-4">
        <CourseCategory category={category.categories[0]} />
        <CourseCategory category={category.categories[1]} />
        <CourseCategory category={category.categories[0]} />
        <CourseCategory category={category.categories[1]} />
      </div>
    </div>
  );
};

export default CourseCategoriesPage;
