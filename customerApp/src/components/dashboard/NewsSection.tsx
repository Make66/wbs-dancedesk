type NewsItem = {
  uid: number;
  title: string;
  author: string;
  teaser: string;
  datetime: string;
  mediaUrl: string;
  istopnews: boolean;
  pathSegment: string;
};

const DUMMY_NEWS: NewsItem[] = [
  {
    uid: 2,
    title: "Lorem Ipsum 2",
    author: "",
    teaser: "Teaser 2 zu Lorem ipsum dolor sit amet",
    datetime: "2026-04-19T08:31:18+02:00",
    mediaUrl: "fileadmin/Alfred_20201114.jpeg",
    istopnews: true,
    pathSegment: "lorem-ipsum-2",
  },
  {
    uid: 1,
    title: "Lorem Ipsum 1",
    author: "",
    teaser: "Teaser for Lorem ipsum dolor sit amet",
    datetime: "2026-04-19T08:27:18+02:00",
    mediaUrl: "fileadmin/Mathias_20201114.jpeg",
    istopnews: false,
    pathSegment: "lorem-ipsum-1",
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

const NewsSection = () => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Neuigkeiten</h2>
      </div>

      <div className="space-y-3">
        {DUMMY_NEWS.map((item) => (
          <div
            key={item.uid}
            className="flex gap-3 rounded-lg p-3 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-sm truncate">{item.title}</p>
                {item.istopnews && (
                  <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    Top-News
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.teaser}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground tabular-nums">{formatDate(item.datetime)}</p>
              {item.author && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.author}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
