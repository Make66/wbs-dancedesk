import ProfileImageUploader from "./ui/image/ProfileImageUploader";

const InstructorItem = () => {
  return (
    <div className="p-4 bg-gray-300 rounded-2xl">
      <div className="flex">
        <div>
          <ProfileImageUploader />
        </div>
        <div className="ml-6">
          <h2 className="text-xl font-semibold">Max Mustermann</h2>
          <p className="text-gray-600">Tanzlehrer für Salsa und Bachata</p>
        </div>
        <div className="ml-8 gap-2">
          <span className="px-3 py-2 bg-black text-xs font-bold text-white rounded-3xl">Salsa</span>
          <span className="px-3 py-2 bg-black text-xs font-bold text-white rounded-3xl">
            Bachata
          </span>
          <span className="px-3 py-2 bg-black text-xs font-bold text-white rounded-3xl">
            HipHop
          </span>
          <span className="px-3 py-2 bg-black text-xs font-bold text-white rounded-3xl">Rumba</span>
        </div>
      </div>
    </div>
  );
};

export default InstructorItem;
