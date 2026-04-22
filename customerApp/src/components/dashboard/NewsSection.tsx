import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPosts } from "../../data/post";
import type { Post } from "../../types/post-types";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const NewsSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    getPosts()
      .then((data) => {
        setHasMore(data.length > 3);
        setPosts(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Neuigkeiten</h2>
        {hasMore && (
          <Link to="/posts" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Mehr →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/news/${post.id}`}
            className="flex flex-col rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post.title ?? ""}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-muted" />
            )}
            <div className="flex flex-col gap-1 p-3 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm line-clamp-2 flex-1">{post.title}</p>
                {post.isTopPost && (
                  <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    Top
                  </span>
                )}
              </div>
              {post.teaser && (
                <p className="text-xs text-muted-foreground line-clamp-2">{post.teaser}</p>
              )}
              <p className="text-xs text-muted-foreground mt-auto pt-1 tabular-nums">
                {post.date ? format(new Date(post.date), "dd. MMM yyyy", { locale: de }) : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
