type Registration = {
  id: number;
  name: string;
  course: string;
  date: string;
  status: "neu" | "bestätigt" | "ausstehend";
};

const DUMMY_REGISTRATIONS: Registration[] = [
  { id: 1, name: "Sophie Wagner", course: "Salsa Basis", date: "Heute, 09:14", status: "neu" },
  { id: 2, name: "Markus Bauer", course: "Discofox Paare", date: "Heute, 08:32", status: "neu" },
  { id: 3, name: "Laura Fischer", course: "Bachata Anfänger", date: "Gestern, 17:55", status: "bestätigt" },
  { id: 4, name: "Jonas Klein", course: "Tango Fortgeschritten", date: "Gestern, 14:20", status: "ausstehend" },
  { id: 5, name: "Emma Schulz", course: "Salsa Basis", date: "12.04.2026", status: "bestätigt" },
];

const statusStyles: Record<Registration["status"], string> = {
  neu: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  bestätigt: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ausstehend: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const RecentRegistrations = () => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-semibold mb-4">Neue Anmeldungen</h2>

      <div className="space-y-2">
        {DUMMY_REGISTRATIONS.map((reg) => (
          <div
            key={reg.id}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {reg.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{reg.name}</p>
                <p className="text-xs text-muted-foreground truncate">{reg.course}</p>
              </div>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[reg.status]}`}>
                {reg.status}
              </span>
              <p className="text-xs text-muted-foreground">{reg.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRegistrations;
