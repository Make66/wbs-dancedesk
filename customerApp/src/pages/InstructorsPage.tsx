import InstructorItem from "../components/InstructorItem";

const InstructorsPage = () => {
  return (
    <div className="w-full bg-white">
      <div className="pl-6 h-20 border-b border-gray-400 flex items-center justify-start">
        <h1 className="text-3xl font-semibold">Tanzlehrer</h1>
      </div>
      <div className="p-6">
        <InstructorItem />
      </div>
    </div>
  );
};

export default InstructorsPage;
