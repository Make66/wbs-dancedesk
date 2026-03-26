import { useParams } from "react-router";

const CourseCategoryPage = () => {
  const { courseId } = useParams();

  return <div>CourseCategoryPage {courseId}</div>;
};

export default CourseCategoryPage;
