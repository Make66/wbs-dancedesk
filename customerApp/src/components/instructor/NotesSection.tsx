import { CgNotes } from "react-icons/cg";

const NotesSection = () => {
  return (
    <div className="w-full rounded-2xl bg-sky-400/40 p-2 shadow-xl">
      <div className="mt-2 flex items-center">
        <CgNotes className="ml-1 mr-4 inline text-2xl" />
        <span className="text-2xl font-semibold">Notizen</span>
      </div>

      <textarea
        className="mt-5 h-40 w-full rounded-2xl border border-muted-foreground bg-background/40 p-4 text-lg focus:outline-none focus:ring-0 focus:shadow-none"
        placeholder="Notizen zum Instructor..."
      />
    </div>
  );
};

export default NotesSection;
