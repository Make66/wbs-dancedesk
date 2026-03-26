import { useParams } from "react-router";

const CourseCategoriesPage = () => {
  const { courseId } = useParams();

  return (
    <div className="p-6">
      <h1 className="mb-10 text-3xl font-semibold">Kurskategorien</h1>
      <span className="font-semibold">ID:</span> {courseId}
    </div>
  );
};

export default CourseCategoriesPage;
