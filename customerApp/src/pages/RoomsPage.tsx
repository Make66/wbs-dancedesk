import { IoMdAddCircleOutline } from "react-icons/io";

const RoomsPage = () => {
  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Räume</h1>
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => {}}
          data-tooltip-id="tooltip"
          data-tooltip-content="Raum hinzufügen"
          data-tooltip-place="right"
        >
          <IoMdAddCircleOutline className="text-3xl" />
        </button>
      </div>
      <div className="p-6 grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <div className="p-5 bg-zinc-400 rounded-2xl">
          <h3 className="text-2xl mb-3">Großer Saal</h3>
          <p className="mb-4">
            Der große Saal bietet Platz für bis zu 200 Personen und ist ideal für Konferenzen,
            Hochzeiten und andere Veranstaltungen.
          </p>
          <span className="text-lg font-bold">Kapazität: 20 Personen</span>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
